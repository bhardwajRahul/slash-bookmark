// @generated by protoc-gen-es v1.3.0
// @generated from file store/workspace_setting.proto (package slash.store, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";

/**
 * @generated from enum slash.store.WorkspaceSettingKey
 */
export declare enum WorkspaceSettingKey {
  /**
   * @generated from enum value: WORKSPACE_SETTING_KEY_UNSPECIFIED = 0;
   */
  WORKSPACE_SETTING_KEY_UNSPECIFIED = 0,

  /**
   * @generated from enum value: WORKSPACE_SETTING_AUTO_BACKUP = 1;
   */
  WORKSPACE_SETTING_AUTO_BACKUP = 1,
}

/**
 * @generated from message slash.store.WorkspaceSetting
 */
export declare class WorkspaceSetting extends Message<WorkspaceSetting> {
  /**
   * @generated from field: slash.store.WorkspaceSettingKey key = 1;
   */
  key: WorkspaceSettingKey;

  /**
   * @generated from oneof slash.store.WorkspaceSetting.value
   */
  value: {
    /**
     * @generated from field: slash.store.AutoBackupWorkspaceSetting auto_backup = 2;
     */
    value: AutoBackupWorkspaceSetting;
    case: "autoBackup";
  } | { case: undefined; value?: undefined };

  constructor(data?: PartialMessage<WorkspaceSetting>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "slash.store.WorkspaceSetting";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): WorkspaceSetting;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): WorkspaceSetting;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): WorkspaceSetting;

  static equals(a: WorkspaceSetting | PlainMessage<WorkspaceSetting> | undefined, b: WorkspaceSetting | PlainMessage<WorkspaceSetting> | undefined): boolean;
}

/**
 * @generated from message slash.store.AutoBackupWorkspaceSetting
 */
export declare class AutoBackupWorkspaceSetting extends Message<AutoBackupWorkspaceSetting> {
  /**
   * Whether auto backup is enabled.
   *
   * @generated from field: bool enabled = 1;
   */
  enabled: boolean;

  /**
   * The cron expression for auto backup.
   * For example, "0 0 0 * * *" means backup at 00:00:00 every day.
   * See https://en.wikipedia.org/wiki/Cron for more details.
   *
   * @generated from field: string cron_expression = 2;
   */
  cronExpression: string;

  /**
   * The maximum number of backups to keep.
   *
   * @generated from field: int32 max_keep = 3;
   */
  maxKeep: number;

  constructor(data?: PartialMessage<AutoBackupWorkspaceSetting>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "slash.store.AutoBackupWorkspaceSetting";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): AutoBackupWorkspaceSetting;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): AutoBackupWorkspaceSetting;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): AutoBackupWorkspaceSetting;

  static equals(a: AutoBackupWorkspaceSetting | PlainMessage<AutoBackupWorkspaceSetting> | undefined, b: AutoBackupWorkspaceSetting | PlainMessage<AutoBackupWorkspaceSetting> | undefined): boolean;
}
