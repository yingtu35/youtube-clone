'use client'
import styles from './page.module.css'
import { useSearchParams } from 'next/navigation'
export default function Watch() {
  const videoSrc = useSearchParams().get('v');
  const videoPrefix = "https://storage.googleapis.com/yingtu-processed-videos";
  return (
    <div>
      <video className={styles.video} controls src={`${videoPrefix}/${videoSrc}`} />
      <h2>title</h2>
      <p>author</p>
    </div>
  )
}