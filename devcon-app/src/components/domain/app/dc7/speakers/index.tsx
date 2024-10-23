import React, { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { Separator } from 'lib/components/ui/separator'
import { Speaker as SpeakerType } from 'types/Speaker'
import FilterIcon from 'assets/icons/filter-tract.svg'
import HeartIcon from 'assets/icons/heart.svg'
import MagnifierIcon from 'assets/icons/magnifier.svg'
import SwipeToScroll from 'lib/components/event-schedule/swipe-to-scroll'
import Image from 'next/image'
import css from './speakers.module.scss'
import { StandalonePrompt } from 'lib/components/ai/standalone-prompt'
import { useRecoilState } from 'recoil'
import { devaBotVisibleAtom } from 'pages/_app'
import TwitterIcon from 'assets/icons/twitter.svg'
import { Link } from 'components/common/link'
import { SessionCard } from 'components/domain/app/dc7/sessions/index'
import { useDraggableLink } from 'lib/hooks/useDraggableLink'

const cardClass = 'flex flex-col border border-solid border-[#E4E6EB] rounded-3xl relative'

const useSpeakerFilter = (speakers: SpeakerType[] | null) => {
  const [text, setText] = useState('')
  const [type, setType] = useState('All')

  if (!speakers) return { filteredSpeakers: [], filters: { text, setText, type, setType } }

  const noFiltersActive = text === '' && type === 'All'

  return {
    filteredSpeakers: speakers.filter(
      speaker =>
        speaker.name.toLowerCase().includes(text.toLowerCase()) &&
        (type === 'All' || speaker.sessions?.some(session => session.type === type))
    ),
    filters: {
      text,
      setText,
      type,
      setType,
    },
    noFiltersActive,
  }
}

export const SpeakerCard = ({ speaker }: { speaker: SpeakerType }) => {
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl bg-white border border-solid border-[#E1E4EA] p-2 shrink-0 cursor-pointer">
      <div className="relative flex flex-row items-center gap-4">
        <Image
          // @ts-ignore
          src={speaker.avatar}
          alt={speaker.name}
          width={48}
          height={48}
          className="rounded-full w-[48px] h-[48px] object-cover"
        />
        <div className="flex flex-col">
          <div className="text-sm font-medium">{speaker.name}</div>
          <div className="text-xs text-[#717784]">{speaker.sessions?.length} sessions</div>
          {speaker?.twitter && (
            <Link className="flex items-center gap-2 self-start text-xs" to={`https://twitter.com/${speaker.twitter}`}>
              <div>@{speaker.twitter}</div>
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center mx-2">
        <HeartIcon className="icon" />
      </div>
    </div>
  )
}

export const SpeakerFilter = ({
  filters,
}: {
  filters: {
    text: string
    setText: (text: string) => void
    type: string
    setType: (type: string) => void
  }
}) => {
  const draggableLink = useDraggableLink()

  return (
    <div data-type="speaker-filter" className="flex flex-col gap-3">
      <div className="flex flex-row gap-3 justify-between w-full p-4 pb-2">
        <div data-type="speaker-filter-search" className="relative">
          <input
            type="text"
            value={filters.text}
            onChange={e => filters.setText(e.target.value)}
            placeholder="Find a speaker"
            className="w-full py-2 px-4 pl-10 bg-white rounded-full border text-sm border-solid border-[#E1E4EA] focus:outline-none"
          />

          <MagnifierIcon
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#99A0AE] icon"
            style={{ '--color-icon': '#99A0AE' }}
          />
        </div>

        <div data-type="speaker-filter-actions" className="flex flex-row gap-3 items-center text-xl pr-2">
          <FilterIcon
            className="icon cursor-pointer hover:scale-110 transition-transform duration-300"
            style={{ '--color-icon': '#99A0AE' }}
          />
          <HeartIcon
            className="icon cursor-pointer hover:scale-110 transition-transform duration-300"
            style={{ '--color-icon': '#99A0AE' }}
          />
        </div>
      </div>

      <div className="mx-4 border-bottom h-[1px]" />

      <div className="flex flex-row gap-3 items-center text-xs overflow-hidden">
        <SwipeToScroll scrollIndicatorDirections={{ right: true }}>
          <div className="flex flex-row gap-3 flex-nowrap p-1 px-4">
            <div
              className={cn(
                'flex shrink-0 items-center justify-center align-middle rounded-full border border-solid bg-white hover:bg-[#EFEBFF] border-transparent shadow px-4 py-1  cursor-pointer select-none transition-all duration-300',
                filters.type === 'All' ? ' border-[#ac9fdf] !bg-[#EFEBFF]' : ''
              )}
              {...draggableLink}
              onClick={e => {
                const result = draggableLink.onClick(e)

                if (!result) return

                filters.setType('All')
              }}
            >
              All
            </div>
            <Separator orientation="vertical" className="h-6" />

            {['Keynote', 'Talk', 'Workshop', 'Panel', 'Lightning', 'CLS'].map(type => (
              <div
                key={type}
                className={cn(
                  'flex shrink-0 items-center justify-center align-middle rounded-full border bg-white hover:bg-[#EFEBFF] border-solid border-transparent shadow px-4 py-1 cursor-pointer select-none transition-all duration-300',
                  filters.type === type ? ' border-[#ac9fdf] !bg-[#EFEBFF]' : ''
                )}
                onClick={() => filters.setType(type)}
              >
                {type}
              </div>
            ))}
          </div>
        </SwipeToScroll>
      </div>

      <div className="mx-4 mb-4 border-bottom h-[1px]" />
    </div>
  )
}

export const SpeakerList = ({ speakers }: { speakers: SpeakerType[] | null }) => {
  const { filteredSpeakers, filters } = useSpeakerFilter(speakers)
  const [_, setDevaBotVisible] = useRecoilState(devaBotVisibleAtom)
  const [selectedLetter, setSelectedLetter] = useState('A')
  const draggableLink = useDraggableLink()

  console.log(speakers?.slice(0, 10))

  const [isSticky, setIsSticky] = useState(false)
  const stickyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stickyElement = stickyRef.current
    if (!stickyElement) return

    const handleScroll = () => {
      const stickyTop = stickyElement.getBoundingClientRect().top
      setIsSticky(stickyTop <= 72) // 72px is the top position when sticky
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial state

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  return (
    <div data-type="speaker-list" className={cn(cardClass)}>
      <SpeakerFilter filters={filters} />

      <div className="flex flex-col gap-3 pb-4 px-4 font-semibold">Featured Speakers</div>

      <div className="overflow-hidden">
        <SwipeToScroll scrollIndicatorDirections={{ right: true }}>
          <div className="flex flex-row gap-3">
            {filteredSpeakers.slice(0, 10).map((speaker, index) => (
              <div
                key={speaker.id}
                className={cn(
                  'flex flex-col items-center justify-center gap-2 rounded-xl bg-white border border-solid border-[#E1E4EA] p-2 shrink-0 cursor-pointer',
                  index === 0 ? 'ml-4' : ''
                )}
                {...draggableLink}
                onClick={e => {
                  const result = draggableLink.onClick(e)

                  if (!result) return
                }}
              >
                <div className="relative rounded-full w-[80px] h-[80px]">
                  <Image
                    // @ts-ignore
                    src={speaker.avatar}
                    alt={speaker.name}
                    width={80}
                    height={80}
                    className="rounded-full w-full h-full mb-2 object-cover"
                  />
                  <div className={cn('absolute inset-0 rounded-full', css['speaker-gradient'])} />
                </div>
                <p className="text-xs font-medium">{speaker.name}</p>
              </div>
            ))}
          </div>
        </SwipeToScroll>
      </div>

      <div data-type="speaker-prompts" className="flex gap-3 m-4 border-bottom mx-4 pb-4">
        <StandalonePrompt
          className="w-full"
          onClick={() => setDevaBotVisible('Help me decide which keynotes to attend speaking about')}
        >
          <div className="truncate">Help me decide which keynotes to attend speaking about</div>
        </StandalonePrompt>
        <StandalonePrompt
          className="w-full"
          onClick={() => setDevaBotVisible('Help me find a speaker that is similar to')}
        >
          <div className="truncate">Help me find a speaker that is similar to</div>
        </StandalonePrompt>
      </div>

      <div className="flex flex-col gap-3 px-4 font-semibold">Speakers</div>

      <div
        className={cn('sticky top-[56px] z-[10] overflow-hidden', isSticky ? css['sticky-glass'] : '')}
        ref={stickyRef}
      >
        <SwipeToScroll scrollIndicatorDirections={{ right: true }}>
          <div className="flex flex-row flex-nowrap gap-3 p-4 py-3 w-full">
            {Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map((letter, index, array) => (
              <div
                key={letter}
                className={cn(
                  'shrink-0 cursor-pointer rounded-full bg-white border border-solid border-[#E1E4EA] w-[26px] h-[26px] text-xs flex items-center justify-center text-[#717784] hover:text-black transition-all duration-300',
                  letter === selectedLetter ? 'border-[#ac9fdf] !bg-[#EFEBFF]' : '',
                  index === array.length - 1 ? 'mr-4' : '' // Add right margin to the last item
                )}
                {...draggableLink}
                onClick={e => {
                  const result = draggableLink.onClick(e)

                  if (!result) return

                  setSelectedLetter(letter)
                }}
              >
                {letter}
              </div>
            ))}
          </div>
        </SwipeToScroll>
      </div>

      <div className="flex flex-col gap-3 mb-4 px-4">
        {filteredSpeakers.map(speaker => {
          if (speaker.name[0] !== selectedLetter) return null

          return <SpeakerCard key={speaker.id} speaker={speaker} />
        })}
      </div>
    </div>
  )
}

export const SpeakerView = ({ speaker }: { speaker: SpeakerType | null }) => {
  const [_, setDevaBotVisible] = useRecoilState(devaBotVisibleAtom)

  return (
    <div data-type="speaker-view" className={cn(cardClass, 'flex flex-col gap-3 p-4 self-start w-full')}>
      <div className="relative rounded-full w-full h-full">
        <Image
          // @ts-ignore
          src={speaker?.avatar}
          // @ts-ignore
          alt={speaker?.name}
          width={393}
          height={393}
          className="rounded-2xl w-full h-full mb-2 aspect-video object-cover"
        />
        <div className={cn('absolute inset-0 rounded-bl-2xl rounded-br-2xl', css['speaker-gradient-2'])} />
        <div className="absolute left-4 font-semibold bottom-2 text-2xl text-white">{speaker?.name}</div>
        <div className="absolute right-6 bottom-4 text-lg flex flex-row gap-4">
          <HeartIcon
            className="icon cursor-pointer hover:scale-110 transition-transform duration-300"
            style={{ '--color-icon': 'white' }}
          />
          {speaker?.twitter && (
            <Link className="flex justify-center items-center" to={`https://twitter.com/${speaker.twitter}`}>
              <TwitterIcon
                className="icon cursor-pointer hover:scale-110 transition-transform duration-300"
                style={{ '--color-icon': 'white' }}
              />
            </Link>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-3  font-semibold">Profile</div>
      <div className="text-sm text-[#717784]">{speaker?.description}</div>
      {speaker?.twitter && (
        <Link className="flex items-center gap-2 self-start" to={`https://twitter.com/${speaker.twitter}`}>
          <TwitterIcon className="icon" style={{ '--color-icon': '#7D52F4' }} />
          <div>@{speaker.twitter}</div>
        </Link>
      )}

      <div className="border-top border-bottom py-4">
        <StandalonePrompt
          className="w-full"
          onClick={() => setDevaBotVisible(`Tell me what I should ask ${speaker?.name} about`)}
        >
          <div className="truncate">Tell me what I should ask {speaker?.name} about</div>
        </StandalonePrompt>
      </div>

      <div className="flex flex-col gap-3 font-semibold">Sessions</div>

      <div className="flex flex-col gap-3">
        {speaker?.sessions?.map(session => (
          <SessionCard key={session.id} {...session} />
        ))}
      </div>
    </div>
  )
}

export const SpeakerLayout = ({ speakers }: { speakers: SpeakerType[] | null }) => {
  if (!speakers) return null

  return (
    <div data-type="speaker-layout" className="flex flex-row gap-3 w-full max-w-full relative">
      <div className="basis-[60%] grow">
        <SpeakerList speakers={speakers} />
      </div>
      <div className="basis-[40%] min-w-[393px] sticky top-[72px] self-start">
        <SpeakerView speaker={speakers[2]} />
      </div>
    </div>
  )
}
