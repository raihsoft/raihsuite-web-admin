import classNames from 'classnames'
import { APP_NAME } from '@/constants/app.constant'
import type { CommonProps } from '@/@types/common'

interface LogoProps extends CommonProps {
    type?: 'full' | 'streamline'
    mode?: 'light' | 'dark'
    imgClass?: string
    logoWidth?: number | string
    textClass?: string
}

const LOGO_SRC_PATH = '/img/logo/'

const Logo = (props: LogoProps) => {
    const {
        type = 'full',
        mode = 'light',
        className,
        imgClass,
        style,
        logoWidth = 'auto',
        textClass,
    } = props

    return (
   <div
            className={classNames('flex items-center gap-2', className)}
            style={{
                ...style,
                width: logoWidth,
            }}
        >

            <span
                className={classNames('text-3xl ml-3 font-bold', textClass)}
                style={{ color: '#1E5555' }}
            >
                Raihsuite
            </span>
        </div>
    )
}

export default Logo
