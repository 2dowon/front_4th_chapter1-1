import LoginPage from "../pages/LoginPage";
import MainPage from "../pages/MainPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProfilePage from "../pages/ProfilePage";
import { useUserStore } from "../stores/useUserStore";

const ROUTE_PAGE_MAP = {
  "/": () => renderMainPage(),
  "/login": () => renderLoginPage(),
  "/profile": () => renderProfilePage(),
};

const routeGuard = (route, type) => {
  const isLogin = useUserStore.isLogin();

  const isHash = type === "hash";
  const refinedRoute = route.replace("#", "");

  if (refinedRoute === "/login" && isLogin) {
    return `${isHash ? "#" : ""}/`;
  }

  if (refinedRoute === "/profile" && !isLogin) {
    return `${isHash ? "#" : ""}/login`;
  }

  return route;
};

export const useRouter = (type) => {
  const historyRouter = (pathname) => {
    let newPathname = pathname || window.location.pathname;
    newPathname = routeGuard(newPathname, type);

    let render = ROUTE_PAGE_MAP[newPathname];
    if (!render) {
      render = () => renderNotFoundPage();
    }

    history.pushState(null, "", newPathname);
    render();
  };

  const hashRouter = (hash) => {
    let newHash = hash || window.location.hash;
    newHash = routeGuard(newHash, type);

    let render = ROUTE_PAGE_MAP[newHash.replace("#", "")];
    if (!render) {
      render = () => renderNotFoundPage();
    }

    history.pushState(null, "", newHash);
    render();
  };

  const router = (value) => {
    return type === "hash" ? hashRouter(value) : historyRouter(value);
  };

  return { router };
};

const renderMainPage = () => {
  document.getElementById("root").innerHTML = MainPage();
  document
    .querySelector("nav")
    .addEventListener("click", (e) => clickEventHandler(e));
};

const renderLoginPage = () => {
  document.getElementById("root").innerHTML = LoginPage();

  const { router } = useRouter();
  const loginForm = document.querySelector("#login-form");
  loginForm.addEventListener("submit", (e) =>
    submitEventHandler({ e, onSuccess: () => router("/") }),
  );
};

const renderProfilePage = () => {
  document.getElementById("root").innerHTML = ProfilePage();
  document
    .querySelector("nav")
    .addEventListener("click", (e) => clickEventHandler(e));

  const profileForm = document.querySelector("#profile-form");
  profileForm.addEventListener("submit", (e) => submitEventHandler({ e }));
};

const renderNotFoundPage = () => {
  document.getElementById("root").innerHTML = NotFoundPage();
};

const clickEventHandler = (e) => {
  const { id, href, tagName } = e.target;

  if (tagName === "A") {
    e.preventDefault();

    let path = href.slice(href.lastIndexOf("/"));

    if (id === "logout") {
      useUserStore.resetUserInfoInLocalStorage();
      path = "/login";
    }

    const { router } = useRouter();
    router(path);
  }
};

const submitEventHandler = ({ e, onSuccess }) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const userInfo = {
    username: formData.get("username"),
    email: formData.get("email") ?? "",
    bio: formData.get("bio") ?? "",
  };

  useUserStore.setUserInfoInLocalStorage(userInfo);

  onSuccess && onSuccess();
};
