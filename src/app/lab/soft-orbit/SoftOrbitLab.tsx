// This review URL intentionally uses the same components as the core homepage.
import EditorialHome from "@/Components/Editorial/EditorialHome";
import { getEditorialHomeData } from "@/lib/releasePresentation";
export default function SoftOrbitLab() { return <EditorialHome {...getEditorialHomeData()} />; }
