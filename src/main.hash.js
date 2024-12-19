import { useRouter } from "./utils/useRouter";

const { router } = useRouter("hash");

window.addEventListener("load", () => router());
window.addEventListener("popstate", () => router());
window.addEventListener("hashchange", () => router());
