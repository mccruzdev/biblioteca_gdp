import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { RolesE } from 'src/types';

@Injectable()
export class ValidateRolePipe implements PipeTransform {
  transform(value: any) {
    if (!Object.values(RolesE).includes(value)) {
      throw new BadRequestException(`Invalid role: ${value}`);
    }
    return value;
  }
}
