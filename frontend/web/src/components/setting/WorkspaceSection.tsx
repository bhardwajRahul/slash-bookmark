import { Button, Input, Link, Option, Select, Switch, Textarea } from "@mui/joy";
import { isEqual } from "lodash-es";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { workspaceServiceClient } from "@/grpcweb";
import { useWorkspaceStore } from "@/stores";
import { Visibility } from "@/types/proto/api/v1/common";
import { WorkspaceSetting } from "@/types/proto/api/v1/workspace_service";
import BetaBadge from "../BetaBadge";

const getDefaultVisibility = (visibility?: Visibility) => {
  if (!visibility || [Visibility.VISIBILITY_UNSPECIFIED, Visibility.UNRECOGNIZED].includes(visibility)) {
    // Default to workspace visibility.
    return Visibility.WORKSPACE;
  }
  return visibility;
};

const WorkspaceSection = () => {
  const { t } = useTranslation();
  const workspaceStore = useWorkspaceStore();
  const [workspaceSetting, setWorkspaceSetting] = useState<WorkspaceSetting>(workspaceStore.setting);
  const originalWorkspaceSetting = useRef<WorkspaceSetting>(workspaceStore.setting);
  const allowSave = !isEqual(originalWorkspaceSetting.current, workspaceSetting);

  const handleEnableSignUpChange = async (value: boolean) => {
    setWorkspaceSetting({
      ...workspaceSetting,
      enableSignup: value,
    });
  };

  const handleInstanceUrlChange = async (value: string) => {
    setWorkspaceSetting({
      ...workspaceSetting,
      instanceUrl: value,
    });
  };

  const handleFaviconProvierChange = async (value: string) => {
    setWorkspaceSetting({
      ...workspaceSetting,
      faviconProvider: value,
    });
  };

  const handleCustomStyleChange = async (value: string) => {
    setWorkspaceSetting({
      ...workspaceSetting,
      customStyle: value,
    });
  };

  const handleDefaultVisibilityChange = async (value: Visibility) => {
    setWorkspaceSetting({
      ...workspaceSetting,
      defaultVisibility: value,
    });
  };

  const handleSaveWorkspaceSetting = async () => {
    const updateMask: string[] = [];
    if (!isEqual(originalWorkspaceSetting.current.enableSignup, workspaceSetting.enableSignup)) {
      updateMask.push("enable_signup");
    }
    if (!isEqual(originalWorkspaceSetting.current.instanceUrl, workspaceSetting.instanceUrl)) {
      updateMask.push("instance_url");
    }
    if (!isEqual(originalWorkspaceSetting.current.customStyle, workspaceSetting.customStyle)) {
      updateMask.push("custom_style");
    }
    if (!isEqual(originalWorkspaceSetting.current.defaultVisibility, workspaceSetting.defaultVisibility)) {
      updateMask.push("default_visibility");
    }
    if (!isEqual(originalWorkspaceSetting.current.faviconProvider, workspaceSetting.faviconProvider)) {
      updateMask.push("favicon_provider");
    }
    if (updateMask.length === 0) {
      toast.error("No changes made");
      return;
    }

    try {
      const setting = (
        await workspaceServiceClient.updateWorkspaceSetting({
          setting: workspaceSetting,
          updateMask: updateMask,
        })
      ).setting as WorkspaceSetting;
      setWorkspaceSetting(setting);
      await workspaceStore.fetchWorkspaceSetting();
      originalWorkspaceSetting.current = setting;
      toast.success("Workspace setting saved successfully");
    } catch (error: any) {
      toast.error(error.details);
    }
  };

  return (
    <div className="w-full flex flex-col sm:flex-row justify-start items-start gap-4 sm:gap-x-16">
      <p className="sm:w-1/4 text-2xl shrink-0 font-semibold text-gray-900 dark:text-gray-500">{t("settings.workspace.self")}</p>
      <div className="w-full sm:w-auto grow flex flex-col justify-start items-start gap-4">
        <div className="w-full flex flex-col justify-start items-start">
          <div className="w-full flex flex-col justify-start items-start">
            <p className="font-medium dark:text-gray-400">Instance URL</p>
            <p className="text-sm text-gray-500 leading-tight">
              {"Mainly used for SEO and social sharing. Leave empty to disallow crawlers."}
            </p>
          </div>
          <Input
            className="w-full mt-2"
            placeholder="Your instance URL. e.g. https://slash.example.com"
            value={workspaceSetting.instanceUrl}
            onChange={(event) => handleInstanceUrlChange(event.target.value)}
          />
        </div>
        <div className="w-full flex flex-row justify-between items-center">
          <div className="w-full flex flex-col justify-start items-start">
            <p className="font-medium dark:text-gray-400">{t("settings.workspace.enable-user-signup.self")}</p>
            <p className="text-sm text-gray-500">{t("settings.workspace.enable-user-signup.description")}</p>
          </div>
          <div>
            <Switch
              size="lg"
              checked={workspaceSetting.enableSignup}
              onChange={(event) => handleEnableSignUpChange(event.target.checked)}
            />
          </div>
        </div>
        <div className="w-full flex flex-row justify-between items-center">
          <div className="w-full flex flex-col justify-start items-start">
            <p className="font-medium dark:text-gray-400">{t("settings.workspace.default-visibility")}</p>
            <p className="text-sm text-gray-500 leading-tight">The default visibility of new shortcuts/collections.</p>
          </div>
          <Select
            className="w-36"
            defaultValue={getDefaultVisibility(workspaceSetting.defaultVisibility)}
            onChange={(_, value) => handleDefaultVisibilityChange(value as Visibility)}
          >
            <Option value={Visibility.PRIVATE}>{t(`shortcut.visibility.private.self`)}</Option>
            <Option value={Visibility.WORKSPACE}>{t(`shortcut.visibility.workspace.self`)}</Option>
            <Option value={Visibility.PUBLIC}>{t(`shortcut.visibility.public.self`)}</Option>
          </Select>
        </div>
        <div className="w-full flex flex-col justify-start items-start">
          <div className="w-full flex flex-row justify-start items-center gap-2">
            <p className="font-medium dark:text-gray-400">Favicon provider</p>
            <BetaBadge />
          </div>
          <p className="text-sm text-gray-500">
            e.g.{" "}
            <Link className="!text-sm" href="https://github.com/yourselfhosted/favicons" target="_blank">
              yourselfhosted/favicons
            </Link>
          </p>
          <Input
            className="w-full mt-2"
            placeholder="The provider of favicon. Empty for default Google S2."
            value={workspaceSetting.faviconProvider}
            onChange={(event) => handleFaviconProvierChange(event.target.value)}
          />
        </div>
        <div className="w-full flex flex-col justify-start items-start">
          <p className="mt-2 font-medium dark:text-gray-400">{t("settings.workspace.custom-style")}</p>
          <Textarea
            className="w-full mt-2"
            placeholder="* {font-family: ui-monospace Monaco Consolas;}"
            minRows={2}
            maxRows={5}
            value={workspaceSetting.customStyle}
            onChange={(event) => handleCustomStyleChange(event.target.value)}
          />
        </div>
        <div>
          <Button color="primary" disabled={!allowSave} onClick={handleSaveWorkspaceSetting}>
            {t("common.save")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSection;
