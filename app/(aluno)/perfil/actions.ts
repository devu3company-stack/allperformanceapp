'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { getCurrentAlunoProfile } from '@/lib/current-aluno'
import { uploadAlunoProfilePhoto } from '@/lib/profile-photos'

export type UpdateProfilePhotoResult = {
  error?: string
  success?: string
}

export async function updateAlunoProfilePhoto(formData: FormData): Promise<UpdateProfilePhotoResult> {
  const profile = await getCurrentAlunoProfile()

  if (!profile) {
    return { error: 'Aluno não autenticado.' }
  }

  const file = formData.get('profilePhoto')

  if (!(file instanceof File) || file.size === 0) {
    return { error: 'Selecione uma imagem para enviar.' }
  }

  if (!file.type.startsWith('image/')) {
    return { error: 'Envie um arquivo de imagem válido.' }
  }

  try {
    const photoUrl = await uploadAlunoProfilePhoto(file, profile.id)

    await prisma.aluno.update({
      where: { id: profile.id },
      data: { fotoUrl: photoUrl },
    })

    revalidatePath('/perfil')
    revalidatePath('/feed')
    revalidatePath('/agenda')

    return { success: 'Foto de perfil atualizada com sucesso.' }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Não foi possível atualizar a foto de perfil.',
    }
  }
}
