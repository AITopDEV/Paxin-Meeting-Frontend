'use client';
import React, { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
import usePreviousPage from './helpers/hooks/usePreviousPage';
import { RootState, store } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { createSelector } from '@reduxjs/toolkit';
import { setWhiteboardCurrentPage } from '@/store/slices/whiteboard';
import { broadcastCurrentPageNumber } from './helpers/handleRequestedWhiteboardData';
import sendAPIRequest from '@/helpers/api/paxMeetAPI';
import { toast } from 'react-toastify';
import {
  CommonResponse,
  SwitchPresenterReq,
  SwitchPresenterTask,
} from '@/helpers/proto/plugnmeet_common_api_pb';
import usePreviousFileId from './helpers/hooks/usePreviousFileId';
import { displaySavedPageData, savePageData } from './helpers/utils';
import { useTranslations } from 'next-intl';

interface IFooterUIProps {
  excalidrawAPI: ExcalidrawImperativeAPI | null;
  isPresenter: boolean;
}
const totalPagesSelector = createSelector(
  (state: RootState) => state.whiteboard,
  (whiteboard) => whiteboard.totalPages
);
const currentPageSelector = createSelector(
  (state: RootState) => state.whiteboard,
  (whiteboard) => whiteboard.currentPage
);
const currentWhiteboardOfficeFileIdSelector = createSelector(
  (state: RootState) => state.whiteboard,
  (whiteboard) => whiteboard.currentWhiteboardOfficeFileId
);

const FooterUI = ({ excalidrawAPI, isPresenter }: IFooterUIProps) => {
  const totalPages = useAppSelector(totalPagesSelector);
  const currentPage = useAppSelector(currentPageSelector);
  const currentWhiteboardOfficeFileId = useAppSelector(
    currentWhiteboardOfficeFileIdSelector
  );
  const previousFileId = usePreviousFileId(currentWhiteboardOfficeFileId);
  const [options, setOptions] = useState<Array<JSX.Element>>();
  const [disablePre, setDisablePre] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const previousPage = usePreviousPage(currentPage);
  const dispatch = useAppDispatch();
  const t = useTranslations('meet');
  const currentUser = store.getState().session.currentUser;
  const isAdmin = currentUser?.metadata?.is_admin;
  const isRecorder = currentUser?.isRecorder;

  useEffect(() => {
    if (previousPage && currentPage !== previousPage && excalidrawAPI) {
      savePreviousPageData();
    }
    //eslint-disable-next-line
  }, [currentPage, previousPage, excalidrawAPI]);

  useEffect(() => {
    if (currentPage > 1) {
      setDisablePre(false);
    }
    if (currentPage === 1) {
      setDisablePre(true);
    }

    if (disableNext) {
      if (currentPage !== totalPages) {
        setDisableNext(false);
      }
    } else {
      if (currentPage === totalPages) {
        setDisableNext(true);
      }
    }
  }, [currentPage, disableNext, totalPages]);

  useEffect(() => {
    const element: Array<JSX.Element> = [];
    for (let i = 0; i < totalPages; i++) {
      element.push(
        <option key={i} value={i + 1}>
          {t('whiteboard.page', { count: i + 1 })}
        </option>
      );
    }
    setOptions(element);
    //eslint-disable-next-line
  }, [totalPages]);

  useEffect(() => {
    if (currentWhiteboardOfficeFileId !== previousFileId && isPresenter) {
      setTimeout(() => {
        if (excalidrawAPI) {
          displaySavedPageData(t, excalidrawAPI, isPresenter, currentPage);
        }
      }, 500);
    }
    //eslint-disable-next-line
  }, [currentWhiteboardOfficeFileId, previousFileId, currentPage]);

  const savePreviousPageData = () => {
    if (!excalidrawAPI) {
      return;
    }
    // for other user we'll clean from parent component
    // because from mobile or small screen pagination part remain collapse
    // no event will be run if this part don't show
    if (isPresenter) {
      if (previousPage) {
        savePageData(excalidrawAPI, previousPage);
      }
      cleanExcalidraw();
      displaySavedPageData(t, excalidrawAPI, isPresenter, currentPage);
    }
  };

  const cleanExcalidraw = () => {
    excalidrawAPI?.updateScene({
      elements: [],
    });
  };

  const setCurrentPage = (page: number) => {
    broadcastCurrentPageNumber(t, page);
    setTimeout(() => {
      dispatch(setWhiteboardCurrentPage(page));
    }, 500);
  };

  const handlePre = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    setCurrentPage(currentPage + 1);
  };

  const renderForAdmin = () => {
    return (
      <div className='wb-page-navigation ml-2 flex'>
        <button
          className='pre flex h-8 w-8 items-center justify-center'
          onClick={handlePre}
          disabled={disablePre}
        >
          <i className='pnm-arrow-left-short text-xl text-black opacity-50 dark:text-white rtl:rotate-180' />
        </button>
        <select
          id='pages'
          name='pages'
          className='pagesOpts block h-8 rounded-md border border-gray-300 bg-white px-3 py-1 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-darkSecondary sm:text-sm'
          onChange={(e) => setCurrentPage(Number(e.currentTarget.value))}
          value={currentPage}
        >
          {options}
        </select>
        <button
          className='next flex h-8 w-8 items-center justify-center'
          onClick={handleNext}
          disabled={disableNext}
        >
          <i className='pnm-arrow-right-short text-xl text-black opacity-50 dark:text-white rtl:rotate-180' />
        </button>
      </div>
    );
  };

  const takeOverPresenter = async () => {
    const body = new SwitchPresenterReq({
      userId: currentUser?.userId,
      task: SwitchPresenterTask.PROMOTE,
    });

    const r = await sendAPIRequest(
      'switchPresenter',
      body.toBinary(),
      false,
      'application/protobuf',
      'arraybuffer'
    );
    const res = CommonResponse.fromBinary(new Uint8Array(r));

    if (res.status) {
      toast(t('left-panel.menus.notice.presenter-changed'), {
        toastId: 'lock-setting-status',
        type: 'info',
      });
    } else {
      // @ts-ignore
      toast(t(res.msg), {
        toastId: 'lock-setting-status',
        type: 'error',
      });
    }
  };

  const renderForParticipant = () => {
    return (
      <div
        className={`relative flex items-center justify-start text-sm md:justify-center ${
          isAdmin && !isRecorder
            ? 'md:pl-12 ltr:pl-3 rtl:pr-3  md:rtl:pr-4'
            : 'ltr:pl-3 rtl:pr-3'
        } `}
      >
        {isAdmin && !isRecorder ? (
          <button
            className='flex h-8 w-8 items-center justify-center rounded-lg border border-solid border-[#3d3d3d] text-[#3d3d3d] hover:bg-[#3d3d3d] hover:text-[#b8b8b8] dark:bg-[#262627] dark:text-[#b8b8b8] dark:hover:bg-[#3d3d3d] ltr:mr-2 rtl:ml-2'
            onClick={takeOverPresenter}
          >
            <i className='pnm-presenter text-[14px]' />
          </button>
        ) : null}
        {t('whiteboard.page', { count: currentPage })}
      </div>
    );
  };

  return <>{isPresenter ? renderForAdmin() : renderForParticipant()}</>;
};

export default React.memo(FooterUI);
