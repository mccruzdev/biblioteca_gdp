import { Reflector } from '@nestjs/core';
import { RolesT } from 'src/types';

export const Roles = Reflector.createDecorator<RolesT>();
