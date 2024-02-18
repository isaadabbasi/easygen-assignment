import { Injectable } from '@nestjs/common';

/**
 * @author: isaadabbasi
 * @notice - I am totally aware using a javascript implementation may not be the best choice
 * Just avoiding the hustle on native bindings that comes with bcrypt.
 * to keep compilation process smooth on cross platforms, choosing "bcryptjs".
 */
import { compare, genSalt, hash } from 'bcryptjs';

@Injectable()
export class CryptService {
  async hash(
    data: string | Buffer,
    salt: Promise<string> = this.getSalt(),
  ): Promise<string> {
    return Promise.resolve(salt).then((salt) => hash(data, salt));
  }

  compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    return compare(data, encrypted);
  }

  getSalt(): Promise<string> {
    return genSalt();
  }
}
