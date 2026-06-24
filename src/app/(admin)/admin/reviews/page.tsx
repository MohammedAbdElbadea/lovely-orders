import { ReviewsList } from "@/components/admin/ReviewsList";
import { getReviews } from "@/lib/services/admin/misc.service";

export default async function AdminReviewsPage() {
  const { data: reviews } = await getReviews(undefined, 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-wide text-luxury-white">Reviews</h1>
        <p className="text-sm text-luxury-muted">Moderate customer product reviews</p>
      </div>
      <ReviewsList reviews={reviews} />
    </div>
  );
}
