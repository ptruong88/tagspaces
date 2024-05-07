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

import React, { useReducer } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
  extractTitle,
  extractFileExtension,
  extractFileName,
  extractDirectoryName,
} from '@tagspaces/tagspaces-common/paths';
import Tooltip from '-/components/Tooltip';
import PlatformIO from '-/services/platform-facade';
import { FolderIcon, MoreMenuIcon } from '-/components/CommonIcons';
import AppConfig from '-/AppConfig';
import EntryContainerMenu from '-/components/EntryContainerMenu';
import { useSelector } from 'react-redux';
import { getLocations } from '-/reducers/locations';
import Box from '@mui/material/Box';
import { dataTidFormat } from '-/services/test';
import { ProTooltip } from '-/components/HelperComponents';
import IconButton from '@mui/material/IconButton';
import BookmarkIcon from '@mui/icons-material/BookmarkTwoTone';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAddTwoTone';
import TagsPreview from '-/components/TagsPreview';
import { Pro } from '-/pro';
import { useTranslation } from 'react-i18next';
import { useOpenedEntryContext } from '-/hooks/useOpenedEntryContext';
import { useNotificationContext } from '-/hooks/useNotificationContext';
import { getAllTags } from '-/services/utils-io';

const FileBadge = styled('span')(({ theme }) => ({
  color: 'white',
  backgroundColor: AppConfig.defaultFileColor,
  padding: 3,
  textShadow: '1px 1px #8f8f8f',
  fontSize: 13,
  marginLeft: 3,
  borderRadius: 3,
}));

interface Props {
  isFileChanged: boolean;
  toggleFullScreen: () => void;
  reloadDocument: () => void;
  startClosingEntry: (event) => void;
  isEntryInFullWidth: boolean;
  desktopMode: boolean;
}

function EntryContainerTitle(props: Props) {
  const {
    isFileChanged,
    reloadDocument,
    toggleFullScreen,
    startClosingEntry,
    isEntryInFullWidth,
    desktopMode,
  } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const { openedEntry, sharingLink, sharingParentFolderLink } =
    useOpenedEntryContext();
  const { showNotification } = useNotificationContext();
  const locations = useSelector(getLocations);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0, undefined);

  const haveBookmark =
    Pro && Pro.bookmarks && Pro.bookmarks.haveBookmark(openedEntry.path);

  const bookmarkClick = () => {
    if (Pro) {
      if (haveBookmark) {
        Pro.bookmarks.delBookmark(openedEntry.path);
      } else {
        Pro.bookmarks.setBookmark(openedEntry.path, sharingLink);
      }
      forceUpdate();
    } else {
      showNotification(
        t('core:toggleBookmark') +
          ' - ' +
          t('thisFunctionalityIsAvailableInPro'),
      );
    }
  };

  let fileTitle: string = openedEntry.path
    ? extractTitle(
        openedEntry.path,
        !openedEntry.isFile,
        PlatformIO.getDirSeparator(),
      )
    : '';

  let fileName: string;
  if (openedEntry.path) {
    if (openedEntry.isFile) {
      fileName = extractFileName(
        openedEntry.path,
        PlatformIO.getDirSeparator(),
      );
    } else {
      fileName = extractDirectoryName(
        openedEntry.path,
        PlatformIO.getDirSeparator(),
      );
    }
  }
  if (!fileName) {
    const currentLocation = locations.find(
      (location) => location.uuid === openedEntry.locationId,
    );
    if (currentLocation) {
      fileName = currentLocation.name;
    }
  }

  return (
    <div
      style={{
        paddingLeft: 5,
        display: 'flex',
        alignItems: 'center',
        marginRight: openedEntry.isFile ? 100 : 0,
        flexDirection: 'row',
        flex: '1 1',
        overflowX: 'auto',
        overflowY: 'hidden',
        marginLeft:
          AppConfig.isMacLike && desktopMode && isEntryInFullWidth ? 60 : 0,
        // @ts-ignore
        WebkitAppRegion: 'drag',
      }}
    >
      {openedEntry.isFile ? (
        <>
          {isFileChanged ? (
            <Tooltip title={t('core:fileChanged')}>
              <span
                style={{
                  color: theme.palette.text.primary,
                  margin: 3,
                }}
              >
                {String.fromCharCode(0x25cf)}
              </span>
            </Tooltip>
          ) : (
            ''
          )}
          <FileBadge
            title={t('core:toggleEntryProperties')}
            data-tid="propsActionsMenuTID"
            aria-controls={Boolean(anchorEl) ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
            // endIcon={<MoreVertIcon sx={{ fontSize: 20 }} />}
            onClick={(event: React.MouseEvent<HTMLElement>) => {
              setAnchorEl(event.currentTarget);
            }}
            style={{
              backgroundColor: openedEntry.meta?.color,
              display: 'flex',
              alignItems: 'center',
              textTransform: 'uppercase',
              paddingLeft: 10,
              // @ts-ignore
              WebkitAppRegion: 'no-drag',
            }}
          >
            {
              //'.' +
              extractFileExtension(
                openedEntry.path,
                PlatformIO.getDirSeparator(),
              )
            }
            <MoreMenuIcon style={{ fontSize: 20 }} />
          </FileBadge>
        </>
      ) : (
        <FileBadge
          title={t('core:toggleEntryProperties')}
          data-tid="propsActionsMenuTID"
          aria-controls={Boolean(anchorEl) ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
          // endIcon={<MoreVertIcon sx={{ fontSize: 20 }} />}
          onClick={(event: React.MouseEvent<HTMLElement>) => {
            setAnchorEl(event.currentTarget);
          }}
          style={{
            backgroundColor: AppConfig.defaultFolderColor,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 10,
            // @ts-ignore
            WebkitAppRegion: 'no-drag',
          }}
        >
          <FolderIcon style={{ fontSize: 20 }} />
          <MoreMenuIcon style={{ fontSize: 20 }} />
        </FileBadge>
      )}
      <Tooltip title={openedEntry.isFile && fileName}>
        <Box
          data-tid={'OpenedTID' + dataTidFormat(fileName)}
          style={{
            color: theme.palette.text.primary,
            display: 'inline',
            fontSize: 17,
            marginLeft: 5,
            maxHeight: 40,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {fileTitle}
        </Box>
      </Tooltip>
      <ProTooltip tooltip={t('core:toggleBookmark')}>
        <IconButton
          data-tid="toggleBookmarkTID"
          aria-label="bookmark"
          size="small"
          onClick={bookmarkClick}
          style={{
            // @ts-ignore
            WebkitAppRegion: 'no-drag',
          }}
        >
          {haveBookmark ? (
            <BookmarkIcon
              style={{
                color: theme.palette.primary.main,
              }}
            />
          ) : (
            <BookmarkAddIcon
              style={{
                color: theme.palette.text.secondary,
              }}
            />
          )}
        </IconButton>
      </ProTooltip>
      <TagsPreview tags={getAllTags(openedEntry)} />
      <EntryContainerMenu
        anchorEl={anchorEl}
        startClosingEntry={startClosingEntry}
        handleClose={() => setAnchorEl(null)}
        reloadDocument={reloadDocument}
        toggleFullScreen={toggleFullScreen}
      />
    </div>
  );
}

export default EntryContainerTitle;
