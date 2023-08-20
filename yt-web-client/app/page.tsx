import Image from 'next/image'
import Link from 'next/link'
import styles from './page.module.css'
import { Video, getAllVideos } from "./firebase/functions"

export default async function Home() {
  const videos = await getAllVideos();

  return (
    <main className={styles.main}>
      <div className={styles.videosContainer}>
        {videos.map((video: Video) => {
          return (
            <Link key={video.id} href={`/watch?v=${video.fileName}`}>
              <Image className={styles.thumbnail} src="/thumbnail.png" alt="thumbnail" width={300} height={200} />
              {/* <p>{video.fileName}</p>
              <p>{video.uid}</p> */}
            </Link>
          )
        })}
      </div>
    </main>
  )
}

export const revalidate = 30;