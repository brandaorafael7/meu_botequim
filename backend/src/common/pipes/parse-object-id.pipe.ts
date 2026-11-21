import {
  PipeTransform,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!value || typeof value !== 'string' || value.trim().length < 2) {
      throw new BadRequestException('ID informado possui formato inválido.');
    }
    return value.trim();
  }
}
