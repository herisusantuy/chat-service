import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async updateProfile(userId: number, fullname: string, avatarUrl: string) {
    if (avatarUrl) {
      const currentUser = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      const updateUser = await this.prisma.user.update({
        where: { id: userId },
        data: {
          fullname,
          avatarUrl,
        },
      });

      if (currentUser.avatarUrl) {
        const imageName = currentUser.avatarUrl.split('/').pop();
        const imagePath = join(
          __dirname,
          '..',
          '..',
          'public',
          'images',
          imageName,
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      return updateUser;
    }
    return await this.prisma.user.update({
      where: { id: userId },
      data: { fullname },
    });
  }
}
