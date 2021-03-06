import { Box, Button, Center, HStack, Text, VStack } from '@chakra-ui/react'
import { State } from 'Store'
import { useEffect, useState } from 'react'
import { FaPaw } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { DOKIDOKI_TIME } from '@/constants/common'
import { getDuplicateItemInRound } from '@/helpers/common'
import { setFinishedRounds } from '@/helpers/firebase'
import { useScreenSize } from '@/helpers/hooks'
import Slot from '@/molecules/Slot'
import AvatarWithName from '@/organisms/AvatarWithName'

const ResultSlot = () => {
  const {
    userInfo: { users, userId, groupId },
    draft: { round, selections, finishedRound },
  } = useSelector((state: State) => state)
  const [showRoulette, setShowRoulette] = useState(true)

  useEffect(() => {
    setShowRoulette(!finishedRound.includes(round - 1))
  }, [finishedRound, round])

  const { duplicateDataUserIdsExcludeWinner, hasDuplicate } =
    getDuplicateItemInRound(selections, userId, round - 1)

  const stopRouletteHandler = () => {
    setShowRoulette(false)
    setFinishedRounds({
      groupId,
      currentFinishedRounds: finishedRound,
      finishedRound: round - 1,
    })
  }

  const { isSP } = useScreenSize()

  return (
    <VStack align="flex-start">
      <HStack w="100%" flexWrap="wrap" justifyContent="space-around">
        {users.map((user, i) => (
          <VStack key={i} w={isSP ? '45%' : '100%'}>
            <AvatarWithName userId={user.userId} showCheck={false} />
            <Slot
              userId={user.userId}
              targetRound={round - 1}
              showRoulette={showRoulette}
              errorUsers={duplicateDataUserIdsExcludeWinner}
            />
            <Box h={5} />
          </VStack>
        ))}
      </HStack>
      {showRoulette && (
        <HStack w="100%" justifyContent="center">
          <Button
            colorScheme="orange"
            onClick={stopRouletteHandler}
            leftIcon={<FaPaw />}
          >
            ในใใใ
          </Button>
        </HStack>
      )}
      {showRoulette && (
        <Text fontSize="sm">
          ๆฝ้ธใๆญขใใใพใงใใฐใใใใฎใพใพใๅพใกใใ?ใใใ
        </Text>
      )}
      {!showRoulette && hasDuplicate && (
        <>
          <Text fontSize="sm">ใใผใฟใฎ้่คใใใใพใใใ</Text>
          <Text fontSize="sm">
            ใฉใณใใ?ๆฝ้ธใฎ็ตๆใ่ๆฏ่ฒใ่ตคใใฆใผใถใผใฏใใฉใใๅ่ฃใฎๅคๆดใๅฟ่ฆใงใใ
          </Text>
          <Text fontSize="sm" color="red">
            OKใใฟใณๆผไธๅพใ่ๆฏ่ฒใ็นๆปใใฆใใใฆใผใถใผใใ้?ใซๅ่ฃใๅคๆดใใฆใใ?ใใใ
          </Text>
        </>
      )}
    </VStack>
  )
}

export default ResultSlot
