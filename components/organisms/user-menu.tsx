import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../molecules/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '../atoms/avatar';
import Link from 'next/link';
import { LocalStorageService } from '@/lib/services/local-storage.service';
import { User, LogOut } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import React from 'react';

interface UserMenuProps {
  user: {
    name: string;
    initials?: string;
    email: string;
    firstName?: string;
    firstLastname?: string;
  };
  isClient: boolean;
  getRoleIcon: () => React.ReactNode;
}

export const UserMenu: React.FC<UserMenuProps> = ({ user, isClient, getRoleIcon }) => {
  const { name, initials, email, firstName, firstLastname } = user;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative h-12 w-12 rounded-full border-2 border-transparent hover:border-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 group p-0 bg-transparent">
        <div className="relative">
          <Avatar className="h-10 w-10 ring-2 ring-white shadow-lg group-hover:shadow-xl transition-shadow duration-300">
            <AvatarImage src="" alt={name} />
            <AvatarFallback className="bg-gradient-to-br from-[#026937] via-[#35944b] to-[#43b649] text-white font-semibold text-sm">
              {String(initials || 'U')}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-green-400 border-2 border-white rounded-full shadow-sm animate-pulse"></div>
          <div className="absolute -top-1 -right-1 h-4 w-4 bg-white rounded-full flex items-center justify-center shadow-md">
            <div className="text-[#026937] scale-75">{getRoleIcon()}</div>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end">
        <div className="flex items-center space-x-3 p-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
          <Avatar className="h-12 w-12 ring-2 ring-[#026937]/20">
            <AvatarImage src="" alt={name} />
            <AvatarFallback className="bg-gradient-to-br from-[#026937] via-[#35944b] to-[#43b649] text-white font-semibold">
              {String(initials || 'U')}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1">
            <span className="text-sm font-semibold text-gray-900">
              {isClient ? `${firstName ?? ''} ${firstLastname ?? ''}`.trim() : 'Cargando...'}
            </span>
            <span className="text-xs text-gray-500">
              {isClient ? email : 'cargando@email.com'}
            </span>
          </div>
        </div>
        <DropdownMenuItem>
          <Link href={ROUTES.PROFILE} className="cursor-pointer w-full flex items-center">
            <User className="mr-3 h-4 w-4" />
            <span>Mi Perfil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button
            type="button"
            className="cursor-pointer w-full flex items-center text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent border-none outline-none"
            onClick={() => {
              LocalStorageService.removeItem('user');
              LocalStorageService.removeItem('userProfile');
              LocalStorageService.removeItem('token');
              LocalStorageService.clear(); // Opcional: limpia todo
              window.location.href = ROUTES.LOGIN;
            }}
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span>Cerrar Sesión</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu; 