import { createContext, useContext } from "react";

type SceneNavigationContextValue = {
  navigateToScene: (sceneIndex: number) => void;
  isTransitioning: boolean;
};

export const SceneNavigationContext =
  createContext<SceneNavigationContextValue | null>(null);

export function useSceneNavigation() {
  const context = useContext(SceneNavigationContext);

  if (!context) {
    throw new Error("useSceneNavigation must be used within SceneNavigationContext.Provider");
  }

  return context;
}
