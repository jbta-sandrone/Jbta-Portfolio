import { createContext, useContext } from "react";

export type SectionNavigationOptions = { focus?: boolean };

type SceneNavigationContextValue = {
  navigateToScene: (sceneIndex: number, options?: SectionNavigationOptions) => void;
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
