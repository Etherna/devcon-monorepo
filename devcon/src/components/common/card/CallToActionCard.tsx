import React from 'react'
import css from './call-to-action.module.scss'
import { Button } from 'lib/components/button'
import { Link } from '../link'
import cn from 'classnames'

type CallToActionProps = {
  title: string
  tag?: string
  children: any
  color?: 'orange' | 'purple' | 'blue'
  BackgroundSvg: any
  link?: any
  linkText?: any
  meta?: string
}

const CallToAction = (props: CallToActionProps) => {
  let className = css['message-card']
  let buttonColor = 'red'

  if (props.color) {
    className += ` ${css[props.color]}`
  }

  switch (props.color) {
    case 'purple': {
      buttonColor = 'purple'
    }

    case 'blue': {
      buttonColor = 'blue'
    }
  }

  return (
    <div className={cn(className, 'rounded-xl shadow')}>
      <div className={css['background']}>
        <props.BackgroundSvg />
      </div>

      <div className={css['header']}>
        <p className="bold font-lg">{props.title}</p>
        {props.tag && <div className={`label purple bold ${css['tag']} ghost rounded-lg`}>{props.tag}</div>}
      </div>

      {props.children}

      <div className={css['footer']}>
        <Link to={props.link}>
          <Button color="purple-1" className="z-10" fill size="lg">
            {props.linkText}
          </Button>
        </Link>
        <p className="bold font-sm">{props.meta}</p>
      </div>
    </div>
  )
}

export default CallToAction
