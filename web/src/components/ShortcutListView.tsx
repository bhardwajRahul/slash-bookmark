import copy from "copy-to-clipboard";
import { shortcutService, workspaceService } from "../services";
import { useAppSelector } from "../store";
import { showCommonDialog } from "./Dialog/CommonDialog";
import Dropdown from "./common/Dropdown";
import Icon from "./Icon";
import showCreateShortcutDialog from "./CreateShortcutDialog";

interface Props {
  workspaceId: WorkspaceId;
  shortcutList: Shortcut[];
}

const ShortcutListView: React.FC<Props> = (props: Props) => {
  const { workspaceId, shortcutList } = props;
  const { user } = useAppSelector((state) => state.user);

  const handleCopyButtonClick = (shortcut: Shortcut) => {
    const workspace = workspaceService.getWorkspaceById(workspaceId);
    copy(`${location.host}/${workspace?.name}/go/${shortcut.name}`);
  };

  const handleDeleteShortcutButtonClick = (shortcut: Shortcut) => {
    showCommonDialog({
      title: "Delete Shortcut",
      content: `Are you sure to delete shortcut \`${shortcut.name}\` in this workspace?`,
      style: "warning",
      onConfirm: async () => {
        await shortcutService.deleteShortcutById(shortcut.id);
      },
    });
  };

  return (
    <div className="w-full flex flex-col justify-start items-start">
      {shortcutList.map((shortcut) => {
        return (
          <div key={shortcut.id} className="w-full flex flex-row justify-between items-start border px-6 py-4 mb-3 rounded-lg">
            <div className="flex flex-row justify-start items-center mr-4">
              <span>{shortcut.name}</span>
              <span className="text-gray-400 text-sm ml-2">({shortcut.description})</span>
            </div>
            <div className="flex flex-row justify-end items-center">
              <span className=" w-12 mr-2 text-gray-600">{shortcut.creator.name}</span>
              <button
                className="cursor-pointer mr-4 hover:opacity-80"
                onClick={() => {
                  handleCopyButtonClick(shortcut);
                }}
              >
                <Icon.Copy className="w-5 h-auto" />
              </button>
              <a className="cursor-pointer mr-4 hover:opacity-80" target="blank" href={shortcut.link}>
                <Icon.ExternalLink className="w-5 h-auto" />
              </a>
              <Dropdown
                actions={
                  <>
                    <button
                      disabled={shortcut.creatorId !== user?.id}
                      className="w-full px-3 text-left leading-10 cursor-pointer rounded hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60"
                      onClick={() => showCreateShortcutDialog(workspaceId, shortcut.id)}
                    >
                      Edit
                    </button>
                    <button
                      disabled={shortcut.creatorId !== user?.id}
                      className="w-full px-3 text-left leading-10 cursor-pointer rounded text-red-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60"
                      onClick={() => {
                        handleDeleteShortcutButtonClick(shortcut);
                      }}
                    >
                      Delete
                    </button>
                  </>
                }
                actionsClassName="!w-24"
              ></Dropdown>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ShortcutListView;