import React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PrevDocumentIcon from '@mui/icons-material/KeyboardArrowUp';
import NextDocumentIcon from '@mui/icons-material/KeyboardArrowDown';
import Tooltip from '-/components/Tooltip';
import { useTranslation } from 'react-i18next';
import { getKeyBindingObject } from '-/reducers/settings';

interface Props {
  isFile: boolean;
  startClosingEntry: (event) => void;
}

function EntryContainerNav(props: Props) {
  const { isFile, startClosingEntry } = props;
  const keyBindings = useSelector(getKeyBindingObject);
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <div
      style={{
        zIndex: 1,
        position: 'absolute',
        right: 0,
        top: 5,
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {isFile && (
        <>
          <Tooltip
            title={t('core:openPrevFileTooltip')}
            keyBinding={keyBindings['prevDocument']}
          >
            <IconButton
              aria-label={t('core:openPrevFileTooltip')}
              data-tid="fileContainerPrevFile"
              onClick={() => {
                window.dispatchEvent(new Event('previous-file'));
                //openPrevFile()
              }}
              // size="large"
            >
              <PrevDocumentIcon />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={t('core:openNextFileTooltip')}
            keyBinding={keyBindings['nextDocument']}
          >
            <IconButton
              aria-label={t('core:openNextFileTooltip')}
              data-tid="fileContainerNextFile"
              onClick={() => {
                window.dispatchEvent(new Event('next-file'));
                // openNextFile()
              }}
              // size="large"
            >
              <NextDocumentIcon />
            </IconButton>
          </Tooltip>
        </>
      )}
      <Tooltip
        title={t('core:closeEntry')}
        keyBinding={keyBindings['closeViewer']}
      >
        <IconButton
          onClick={startClosingEntry}
          aria-label={t('core:closeEntry')}
          data-tid="fileContainerCloseOpenedFile"
          // size="large"
        >
          <CloseIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
}

export default EntryContainerNav;
