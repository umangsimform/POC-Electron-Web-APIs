import createWebStorage from "redux-persist/lib/storage/createWebStorage";
interface Storage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}
interface PersistConfig {
  key: string;
  storage: Storage;
  whitelist: string[];
}

const createNoopStorage = (): Storage => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const storage: Storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

export const authConfig: PersistConfig = {
  key: "auth",
  storage: storage,
  whitelist: ["user", "isLoggedIn"],
};

export const postsConfig: PersistConfig = {
  key: "posts",
  storage: storage,
  whitelist: ["posts"],
};
export const arrivalConfig: PersistConfig = {
  key: "arrivals",
  storage: storage,
  whitelist: ["currentArrivalTab"],
};

export const commonConfig: PersistConfig = {
  key: "commonStates",
  storage: storage,
  whitelist: ["headerMenu"],
};

export const allPersists = {
  authConfig,
  postsConfig,
  arrivalConfig,
  commonConfig,
};
