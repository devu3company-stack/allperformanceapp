import { createAdminClient } from '@/lib/supabase/admin'

const PROFILE_PHOTO_BUCKET = 'profile-photos'

function getFileExtension(file: File) {
  const fileNameExtension = file.name.split('.').pop()?.trim().toLowerCase()

  if (fileNameExtension) {
    return fileNameExtension
  }

  if (file.type === 'image/png') {
    return 'png'
  }

  if (file.type === 'image/webp') {
    return 'webp'
  }

  if (file.type === 'image/jpeg') {
    return 'jpg'
  }

  return 'bin'
}

async function ensureProfilePhotoBucket() {
  const supabaseAdmin = createAdminClient()
  const { error } = await supabaseAdmin.storage.createBucket(PROFILE_PHOTO_BUCKET, {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
  })

  if (error && !error.message.toLowerCase().includes('already exists')) {
    throw error
  }

  return supabaseAdmin
}

export async function uploadAlunoProfilePhoto(file: File, alunoId: string) {
  const supabaseAdmin = await ensureProfilePhotoBucket()
  const extension = getFileExtension(file)
  const filePath = `alunos/${alunoId}-${Date.now()}.${extension}`
  const fileBuffer = Buffer.from(await file.arrayBuffer())

  const { error } = await supabaseAdmin.storage
    .from(PROFILE_PHOTO_BUCKET)
    .upload(filePath, fileBuffer, {
      contentType: file.type || 'application/octet-stream',
      upsert: true,
    })

  if (error) {
    throw error
  }

  const { data } = supabaseAdmin.storage.from(PROFILE_PHOTO_BUCKET).getPublicUrl(filePath)
  return data.publicUrl
}
