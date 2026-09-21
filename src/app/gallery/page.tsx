import CommissionGallery from "@/Components/Editorial/CommissionGallery";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "OKISO / gallery",
  "My commissioned art, animations and alternate versions. Meet the artists behind each piece.",
  "/gallery",
);

export default function GalleryPage() {
  return <CommissionGallery />;
}
