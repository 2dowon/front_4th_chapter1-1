import { useRouter } from "./utils/useRouter";

const { router } = useRouter("history");

window.addEventListener("load", () => router());
window.addEventListener("popstate", () => router());
