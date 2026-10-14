import CommissionDownloads from "@/Components/Editorial/CommissionDownloads";
import { pageMetadata } from "@/lib/seo";
export const metadata = { ...pageMetadata("OKISO / commission previews", "Commissioned artwork previews, organized by artist. Original files remain private.", "/downloads"), robots: { index: false, follow: false } };
export default function DownloadsPage() { return <CommissionDownloads />; }
