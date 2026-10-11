import CommissionDownloads from "@/Components/Editorial/CommissionDownloads";
import { pageMetadata } from "@/lib/seo";
export const metadata = { ...pageMetadata("OKISO / downloads", "Original commission files and PSDs, organized by artist.", "/downloads"), robots: { index: false, follow: false } };
export default function DownloadsPage() { return <CommissionDownloads />; }
