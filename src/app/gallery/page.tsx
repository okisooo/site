import CommissionGallery from "@/Components/Editorial/CommissionGallery";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("OKISO | Commissioned Art Gallery", "Explore OKISO’s commissioned illustrations, animated artwork and alternate versions, with credits and links to the artists behind every work.", "/gallery");

export default function GalleryPage() {
  return <CommissionGallery />;
}
