/**
 * TagSpaces - universal file and folder organizer
 * Copyright (C) 2017-present TagSpaces UG (haftungsbeschraenkt)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License (version 3) as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

import React, { forwardRef, Ref, useImperativeHandle, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { TS } from '-/tagspaces.namespace';
import { actions as AppActions, AppDispatch } from '-/reducers/app';
import { useIOActionsContext } from '-/hooks/useIOActionsContext';

interface Props {
  id: string;
  directoryPath: string;
  //toggleProgressDialog: () => void;
}

export interface FileUploadContainerRef {
  onFileUpload: () => void;
}

const FileUploadContainer = forwardRef(
  (props: Props, ref: Ref<FileUploadContainerRef>) => {
    const dispatch: AppDispatch = useDispatch();
    const { id, directoryPath } = props;
    const { uploadFilesAPI } = useIOActionsContext();

    const onUploadProgress = (progress, abort, fileName) => {
      dispatch(AppActions.onUploadProgress(progress, abort, fileName));
    };

    useImperativeHandle(ref, () => ({
      onFileUpload() {
        /* if (AppConfig.isCordovaAndroid) {
          PlatformIO.selectFileDialog()
            .then(file => {
              console.log('file', file.uri);
              return [file.uri];
            })
            .then(arrFiles => {
              props
                .uploadFiles(
                  arrFiles,
                  props.directoryPath,
                  props.onUploadProgress
                )
                .then(fsEntries => {
                  props.reflectCreateEntries(fsEntries);
                  return true;
                })
                .catch(error => {
                  console.log('uploadFiles', error);
                });
              props.toggleUploadDialog();
              return true;
            })
            .catch(error => {
              console.log('uploadFiles', error);
            });
        } else { */
        fileInput.current.click();
        // }
      },
    }));

    /* if (AppConfig.isCordovaAndroid) {
      return null;
    } */

    const fileInput = useRef<HTMLInputElement>(null);

    function handleFileInputChange(selection: any) {
      // console.log("Selected File: "+JSON.stringify(selection.currentTarget.files[0]));
      // const file = selection.currentTarget.files[0];
      dispatch(AppActions.resetProgress());
      dispatch(AppActions.toggleUploadDialog());
      uploadFilesAPI(
        Array.from(selection.currentTarget.files),
        directoryPath,
        onUploadProgress,
      )
        .then((fsEntries: Array<TS.FileSystemEntry>) => {
          /*if (directoryPath === currentDirectoryPath) {
            addDirectoryEntries(fsEntries);
            dispatch(AppActions.reflectCreateEntries(fsEntries));
            setSelectedEntries(fsEntries);
          }*/
          return true;
        })
        .catch((error) => {
          console.log('uploadFiles', error);
        });
    }

    return (
      <input
        id={id}
        style={{ display: 'none' }}
        ref={fileInput}
        accept="*"
        type="file"
        multiple
        onChange={handleFileInputChange}
      />
    );
  },
);

export default FileUploadContainer;
