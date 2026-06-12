import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rateLimiter'
import { deleteSlot } from '@/services/slotService'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimitResponse = await checkRateLimit(request, {
    prefix: 'admin',
    maxRequests: 20,
    windowSeconds: 60,
  })
  if (rateLimitResponse) return rateLimitResponse

  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const slotId = parseInt(id, 10)

  if (isNaN(slotId)) {
    return NextResponse.json({ error: 'Invalid slot ID' }, { status: 400 })
  }

  const deleted = await deleteSlot(slotId)

  if (!deleted) {
    return NextResponse.json({ error: 'Slot not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true }, {
    headers: { 'Cache-Control': 'private, no-store' },
  })
}
