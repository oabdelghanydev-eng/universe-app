import { notFound } from 'next/navigation';
import { getListing } from '@/actions/listings';
import { getServerSession } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import ListingDetailClient from './ListingDetailClient';

interface ListingPageProps {
    params: Promise<{ id: string }>;
}

export default async function ListingPage({ params }: ListingPageProps) {
    const { id } = await params;
    const session = await getServerSession();

    const result = await getListing(id);

    if (!result.success || !result.data) {
        notFound();
    }

    const listing = result.data;

    // Get seller info
    const sellerDoc = await adminDb.collection('users').doc(listing.userId).get();
    const seller = sellerDoc.exists ? sellerDoc.data() : null;

    const isOwner = session?.uid === listing.userId;

    // Serialize dates for client component
    const serializedListing = {
        ...listing,
        createdAt: listing.createdAt?.toISOString() || null,
        updatedAt: listing.updatedAt?.toISOString() || null,
        deletedAt: listing.deletedAt?.toISOString() || null,
        flaggedAt: listing.flaggedAt?.toISOString() || null,
        lastAlgoliaSyncAt: listing.lastAlgoliaSyncAt?.toISOString() || null,
    };

    const sellerInfo = seller ? {
        fullName: seller.fullName || 'مستخدم',
        photoURL: seller.photoURL || null,
        academicId: seller.academicId || '',
    } : null;

    return (
        <ListingDetailClient
            listing={serializedListing}
            seller={sellerInfo}
            isOwner={isOwner}
        />
    );
}
