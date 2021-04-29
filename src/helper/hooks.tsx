import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  defaultVal as componentDefault,
  hideNavComponent,
  hideToast,
  setNavComponent,
  setToast,
  showNavComponent,
  showToast,
  showLoading,
  hideLoading,
  setModalComponent,
  showModal,
  hideModal,
} from 'src/store/component'
import moment from 'moment'
import { setGroupId, setUserId } from 'src/store/userInfo'

import { Selection, State } from 'Store'
import { sessionStorageInfo } from 'src/helper'
import {
  findAvatarPathFromUserId,
  findUserNameFromUserId,
  findUserOwnSelection,
  createSelection,
  makeNextItem,
  isUserFinishEnter,
} from 'src/helper'

export const usePrevious = (value: any, initialVal?: any) => {
  const ref = useRef(initialVal ?? null)
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

export const useNav = () => {
  const dispatch = useDispatch()

  return {
    setNav: ({ title, component }: { title: string; component: any }) =>
      dispatch(setNavComponent({ title, component })),
    showNav: () => dispatch(showNavComponent()),
    hideNav: () => dispatch(hideNavComponent()),
  }
}

export const useModal = () => {
  const dispatch = useDispatch()
  return {
    setModalComponent: ({ component, title }: any) =>
      dispatch(setModalComponent({ component, title })),
    showModal: () => dispatch(showModal()),
    hideModal: () => dispatch(hideModal()),
  }
}

export const useToast = () => {
  const dispatch = useDispatch()

  return {
    setToast: ({
      message = componentDefault.toast.message,
      position = componentDefault.toast.position,
      duration = componentDefault.toast.duration,
      color = componentDefault.toast.color,
    }) => dispatch(setToast({ message, position, duration, color })),
    showToast: () => dispatch(showToast()),
    hideToast: () => dispatch(hideToast()),
  }
}

export const usePath = () => {
  return {
    query: useParams(),
    ...useLocation(),
    windowPath: window.location.pathname,
    groupIdFromPath: window.location.pathname
      .replace('/entry/', '')
      .replace('/draft/', ''),
  }
}

export const useIsLocation = (target: string[], { exact = false } = {}) => {
  const { pathname } = useLocation()
  if (exact) {
    return target.some(path => pathname === path)
  } else {
    return target.some(path => pathname.includes(path))
  }
}

export const useLoading = () => {
  const dispatch = useDispatch()
  const {
    component: { loading },
  } = useSelector((state: State) => state)
  return {
    isLoadingShow: loading.show,
    showLoading: () => dispatch(showLoading()),
    hideLoading: () => dispatch(hideLoading()),
  }
}

export const useInfo = () => {
  const dispatch = useDispatch()
  const { setUserIdToSessionStorage } = sessionStorageInfo()
  const groupIdProcess = (groupId: string) => {
    dispatch(setGroupId({ groupId }))
  }
  const userIdProcess = (userId: string) => {
    setUserIdToSessionStorage(userId)
    dispatch(setUserId(userId))
  }
  return {
    addGroupId: (groupId: string) => groupIdProcess(groupId),
    addUserId: (userId: string) => userIdProcess(userId),
  }
}

export const useChat = () => {
  const { t } = useTranslation()
  const {
    userInfo,
    chat: { context },
  } = useSelector((state: State) => state)

  const chatInfo = context.map(({ message, userId, date }) => ({
    isMyLog: userInfo.userId === userId,
    message,
    userId,
    userName: findUserNameFromUserId(userInfo.users, userId),
    date: moment(date).format(t('M/D')),
    //  なぜか時間が正常に取得できないため頑張る
    time: `${date
      .getHours()
      .toString()
      .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`,
    avatar: findAvatarPathFromUserId(userInfo.users, userId),
  }))
  return {
    chatInfo,
  }
}

export const useGetOneSelection = (userId: string) => {
  const {
    draft: { selections },
  } = useSelector((state: State) => state)

  const oneSelection = selections.find(selection => selection.userId === userId)

  return oneSelection ? oneSelection.selection : []
}

export const useItems = () => {
  const {
    userInfo: { userId },
    draft: { round, selections },
  } = useSelector((state: State) => state)

  const addItem = (targetUserId: string, roundIndex: number, item: string) => {
    const updateUserId = targetUserId || userId
    const updateRoundIndex = roundIndex === 0 ? round : roundIndex
    if (!item) {
      return false
    }
    const selection = findUserOwnSelection(selections, updateUserId)
    const nextSelection = makeNextItem(selection, updateRoundIndex, item)
    createSelection({ userId: updateUserId, selection: nextSelection })
  }

  return {
    addItem: ({ targetUserId = '', roundIndex = 0, item = '' }) =>
      addItem(targetUserId, roundIndex, item),
    // updateSelection: () => updateSelection(),
  }
}

export const useIsUserFinishEnter = (userId: string) => {
  const {
    draft: { round, selections },
  } = useSelector((state: State) => state)
  return isUserFinishEnter(selections, userId, round)
}

export const useGetCurrentItem = (userId: string, targetRound = 0) => {
  const {
    draft: { round, selections },
  } = useSelector((state: State) => state)
  const compareRound = targetRound || round
  const selection = findUserOwnSelection(selections, userId)
  const target = selection.find(s => s.round === compareRound)
  return target?.item ?? ''
}
