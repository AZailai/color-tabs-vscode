import * as vscode from "vscode";
import getSettings from "./getSettings";

type ColorCustomization = { [key: string]: string | undefined } | undefined;

const COLOR_CUSTOMIZATIONS = "colorCustomizations";

const invertHex = (hex?: string) => {
  if (!hex) {
    return;
  }

  return Number(hex.replace("#", "0x")) > 0xffffff / 2 ? "#000000" : "#ffffff";
};

const Lighter = (hex?: string) => {
  if (!hex) {
    return;
  }

  return hex + "20";
};

export default async (color?: string) => {
  const colorInverted = invertHex(color);
  const settings = vscode.workspace.getConfiguration("workbench");
  const currentColorCustomization: ColorCustomization =
    settings.get(COLOR_CUSTOMIZATIONS) || {};
  const {
    tabBorder,
    tabBackground,
    titleBackground,
    activityBarBackground,
    statusBarBackground,
    tabInactiveBackground,
  } = getSettings();

  const colorLighter = Lighter(color)

  const tabBarBorderColor = color;
  const titleBarBackgroundColor = color;
  const titleBarForegroundColor = colorInverted;
  const activityBarBackgroundColor = color;
  const activityBarForegroundColor = colorInverted;
  const statusBarBackgroundColor = color;
  const statusBarForegroundColor = colorInverted;

  const colorCustomization: ColorCustomization = {
    ...currentColorCustomization,
    ...(tabBorder ? { "tab.activeBorder": tabBarBorderColor } : {}),
    ...(tabBackground ? { "tab.activeBackground": tabBarBorderColor } : {}),
    ...(titleBackground
      ? { "titleBar.activeBackground": titleBarBackgroundColor }
      : {}),
    ...(titleBackground
      ? { "titleBar.activeForeground": titleBarForegroundColor }
      : {}),
    ...(activityBarBackground
      ? { "activityBar.background": activityBarBackgroundColor }
      : {}),
    ...(activityBarBackground
      ? { "activityBar.foreground": activityBarForegroundColor }
      : {}),
    ...(statusBarBackground
      ? { "statusBar.background": statusBarBackgroundColor }
      : {}),
    ...(statusBarBackground
      ? { "statusBar.foreground": statusBarForegroundColor }
      : {}),
    ...(tabInactiveBackground ? { "tab.inactiveBackground": colorLighter } : {}),
  };

  const hasItems = Object.keys(colorCustomization).filter(
    (x) => !!colorCustomization[x]
  ).length;
  settings.update(
    COLOR_CUSTOMIZATIONS,
    hasItems ? colorCustomization : undefined,
    vscode.ConfigurationTarget.Workspace
  );
};