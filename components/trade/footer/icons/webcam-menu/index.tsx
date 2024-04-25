import React from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Room } from 'livekit-client';
import WebcamMenuItems from './items';

interface IWebcamMenuProps {
  currentRoom: Room;
}

const WebcamMenu = ({ currentRoom }: IWebcamMenuProps) => {
  const render = () => {
    return (
      <div className='absolute -bottom-[3px] right-3 md:bottom-0 lg:right-6'>
        <Menu>
          {({ open }) => (
            <>
              <Menu.Button>
                <div className='arrow-down absolute -bottom-1 -right-1 flex h-[15px] w-[15px] items-center justify-center rounded-full bg-white dark:bg-secondaryColor'>
                  <i className='pnm-arrow-below text-[10px] dark:text-darkSecondary sm:text-[12px]' />
                </div>
              </Menu.Button>

              {/* Use the Transition component. */}
              <Transition
                show={open}
                enter='transition duration-100 ease-out'
                enterFrom='transform scale-95 opacity-0'
                enterTo='transform scale-100 opacity-100'
                leave='transition duration-75 ease-out'
                leaveFrom='transform scale-100 opacity-100'
                leaveTo='transform scale-95 opacity-0'
              >
                <WebcamMenuItems currentRoom={currentRoom} />
              </Transition>
            </>
          )}
        </Menu>
      </div>
    );
  };

  return <>{render()}</>;
};

export default WebcamMenu;
