import { useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { authService } from '@services/auth.service';
import { useAuthStore } from '@store/authStore';
import { getImageUrl } from '@/utils/image';
import toast from 'react-hot-toast';

interface Props {
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { outer: 'w-16 h-16', icon: 'w-4 h-4', text: 'text-xl' },
  md: { outer: 'w-24 h-24', icon: 'w-5 h-5', text: 'text-2xl' },
  lg: { outer: 'w-32 h-32', icon: 'w-6 h-6', text: 'text-3xl' },
};

export function AvatarUpload({ size = 'md' }: Props) {
  const { user, updateUser } = useAuthStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const s = sizeMap[size];

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Faqat rasm fayllari qabul qilinadi');
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    const fd = new FormData();
    fd.append('avatar', file);
    setLoading(true);
    try {
      const res = await authService.uploadAvatar(fd);
      const avatarUrl = res.data?.data?.avatarUrl ?? res.data?.avatarUrl;
      updateUser({ avatar: avatarUrl });
      toast.success('Rasm saqlandi');
    } catch {
      toast.error('Rasm yuklanmadi');
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const currentSrc = preview || (user?.avatar ? getImageUrl(user.avatar) : null);
  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`;

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className={`${s.outer} relative rounded-full overflow-hidden group border-2 border-border hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40`}
      >
        {currentSrc ? (
          <img src={currentSrc} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className={`w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold ${s.text}`}>
            {initials}
          </div>
        )}

        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          {loading ? (
            <Loader2 className={`${s.icon} text-white animate-spin`} />
          ) : (
            <Camera className={`${s.icon} text-white`} />
          )}
        </div>
      </button>

      <span className="text-xs text-muted-foreground">Rasmga bosing</span>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
    </div>
  );
}
