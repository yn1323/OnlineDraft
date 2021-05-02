import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { getDuplicateItemInRound, useModal } from 'src/helper'
import { SLOT_TIME } from 'src/constant'

import ResultSlot from 'src/component/organism/ResultSlot'

import 'src/asset/scss/component/ResultModal.scss'

import { State } from 'Store'
import { IonButton } from '@ionic/react'

interface Props {
  targetRound: number
}

const ResultModal = ({ targetRound }: Props) => {
  const {
    draft: { selections },
    userInfo: { users },
  } = useSelector((state: State) => state)
  const { t } = useTranslation()
  const { hideModal } = useModal()
  const [hasErrorMsg, setHasErrorMsg] = useState(<></>)
  const [hasFinishedSlot, setHasFinishedSlot] = useState(false)

  useEffect(() => {
    const { hasDuplicate } = getDuplicateItemInRound(
      selections,
      '',
      targetRound
    )
    if (hasFinishedSlot && hasDuplicate) {
      setHasErrorMsg(
        <div className="conflict">
          {t('データの重複がありました。')}
          <br />
          {t(
            'ランダム抽選の結果、背景色が赤いユーザーはドラフト候補の変更が必要です。'
          )}
          <br />
          <span className="caution">
            {t('背景色が点滅しているユーザーから順に候補を変更してください。')}
          </span>
        </div>
      )
    }
  }, [hasFinishedSlot])

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasFinishedSlot(true)
    }, SLOT_TIME + 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="resultModalWrapper">
      {hasErrorMsg}
      <section className="result">
        <ResultSlot />
      </section>
      {hasFinishedSlot && (
        <>
          <hr />
          <div className="closeBtn align-centerVH">
            <IonButton fill="outline" onClick={hideModal}>
              Close
            </IonButton>
          </div>
        </>
      )}
    </div>
  )
}

export default ResultModal
