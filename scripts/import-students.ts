// Student Import Script - Bulk user import
/**
 * import-students.ts
 * 
 * Import students from CSV file to Firestore.
 * Idempotent: skips existing records, safe to re-run.
 * 
 * Usage:
 *   npx ts-node scripts/import-students.ts students.csv
 *   npx ts-node scripts/import-students.ts students.csv --dry-run
 */

import * as fs from 'fs';
import * as path from 'path';
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Firebase Admin
function getServiceAccount() {
    // Try GOOGLE_APPLICATION_CREDENTIALS first (file path)
    const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (credPath && fs.existsSync(credPath)) {
        return JSON.parse(fs.readFileSync(credPath, 'utf8'));
    }

    // Try FIREBASE_SERVICE_ACCOUNT_KEY (JSON string)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    }

    // Try to find any firebase admin SDK json file
    const files = fs.readdirSync('.');
    const serviceAccountFile = files.find(f => f.includes('firebase-adminsdk') && f.endsWith('.json'));
    if (serviceAccountFile) {
        return JSON.parse(fs.readFileSync(serviceAccountFile, 'utf8'));
    }

    throw new Error('No Firebase service account credentials found');
}

admin.initializeApp({
    credential: admin.credential.cert(getServiceAccount()),
});

const db = admin.firestore();

// Validation patterns
const ACADEMIC_ID_PATTERN = /^\d{4,10}$/;

interface StudentRecord {
    academicId: string;
    fullName: string;
}

interface ImportResult {
    total: number;
    created: number;
    skipped: number;
    errors: string[];
}

function parseCSV(filePath: string): StudentRecord[] {
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove BOM if present
    if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
    }

    const lines = content.split(/\r?\n/).filter(line => line.trim());

    // Check header to determine column order
    const header = lines[0].toLowerCase();
    const isNameFirst = header.includes('name') && header.indexOf('name') < header.indexOf('id');

    // Skip header row
    const dataLines = lines.slice(1);

    const records: StudentRecord[] = [];

    dataLines.forEach((line, index) => {
        const [col1, col2] = line.split(',').map(s => s.trim());

        // Handle both column orders
        const fullName = isNameFirst ? col1 : col2;
        const academicId = isNameFirst ? col2 : col1;

        // Skip empty/incomplete lines
        if (!academicId || !fullName) {
            console.warn(`⚠️  Line ${index + 2}: Skipping - missing data`);
            return;
        }

        records.push({ academicId, fullName });
    });

    return records;
}

function validateRecords(records: StudentRecord[]): string[] {
    const errors: string[] = [];
    const seenIds = new Set<string>();

    records.forEach((record, index) => {
        // Check academicId format
        if (!ACADEMIC_ID_PATTERN.test(record.academicId)) {
            errors.push(`Line ${index + 2}: Invalid academicId format "${record.academicId}" (must be 4-10 digits)`);
        }

        // Check for empty fullName
        if (!record.fullName || record.fullName.length < 2) {
            errors.push(`Line ${index + 2}: Invalid fullName "${record.fullName}"`);
        }

        // Check for duplicates in CSV
        if (seenIds.has(record.academicId)) {
            errors.push(`Line ${index + 2}: Duplicate academicId "${record.academicId}" in CSV`);
        }
        seenIds.add(record.academicId);
    });

    return errors;
}

async function importStudents(records: StudentRecord[], dryRun: boolean): Promise<ImportResult> {
    const result: ImportResult = {
        total: records.length,
        created: 0,
        skipped: 0,
        errors: [],
    };

    const BATCH_SIZE = 500;

    for (let i = 0; i < records.length; i += BATCH_SIZE) {
        const batch = db.batch();
        const batchRecords = records.slice(i, i + BATCH_SIZE);
        let batchCreated = 0;
        let batchSkipped = 0;

        for (const record of batchRecords) {
            const docRef = db.collection('students').doc(record.academicId);

            // Check if exists
            const existing = await docRef.get();

            if (existing.exists) {
                batchSkipped++;
                continue;
            }

            if (!dryRun) {
                batch.set(docRef, {
                    fullName: record.fullName,
                    isRegistered: false,
                    registeredAt: null,
                });
            }
            batchCreated++;
        }

        if (!dryRun && batchCreated > 0) {
            await batch.commit();
        }

        result.created += batchCreated;
        result.skipped += batchSkipped;

        console.log(`Processed ${Math.min(i + BATCH_SIZE, records.length)}/${records.length} records...`);
    }

    return result;
}

async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0 || args[0] === '--help') {
        console.log(`
Usage: npx ts-node scripts/import-students.ts <csv-file> [--dry-run]

Arguments:
  <csv-file>   Path to CSV file with columns: academicId,fullName
  --dry-run    Validate and show what would be imported without writing

CSV Format:
  academicId,fullName
  20210001,أحمد محمد علي السيد
  20210002,فاطمة حسن عبدالله
`);
        process.exit(0);
    }

    const csvPath = args[0];
    const dryRun = args.includes('--dry-run');

    if (!fs.existsSync(csvPath)) {
        console.error(`Error: File not found: ${csvPath}`);
        process.exit(1);
    }

    console.log(`\n📂 Reading CSV: ${csvPath}`);
    console.log(`🔧 Mode: ${dryRun ? 'DRY RUN (no changes)' : 'LIVE IMPORT'}\n`);

    try {
        // Parse CSV
        const records = parseCSV(csvPath);
        console.log(`📊 Found ${records.length} records in CSV\n`);

        // Validate
        const validationErrors = validateRecords(records);
        if (validationErrors.length > 0) {
            console.error('❌ Validation errors:');
            validationErrors.forEach(e => console.error(`  - ${e}`));
            process.exit(1);
        }
        console.log('✅ CSV validation passed\n');

        // Import
        const result = await importStudents(records, dryRun);

        console.log(`\n${'='.repeat(50)}`);
        console.log(`📊 Import Summary:`);
        console.log(`   Total records: ${result.total}`);
        console.log(`   Created: ${result.created}`);
        console.log(`   Skipped (existing): ${result.skipped}`);

        if (dryRun) {
            console.log(`\n⚠️  DRY RUN - No changes were made`);
            console.log(`   Run without --dry-run to import`);
        } else {
            console.log(`\n✅ Import completed successfully`);
        }

    } catch (error) {
        console.error('\n❌ Error:', error);
        process.exit(1);
    }

    process.exit(0);
}

main();

