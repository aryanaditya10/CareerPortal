import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import Navbar from './shared/Navbar'
import Footer from './shared/Footer'
import Job from './Job'
import { MATCH_API_END_POINT } from '@/utils/constant'
import { motion } from 'framer-motion'

const MatchedJobs = () => {
  const { user } = useSelector(store => store.auth)
  const [matchedJobs, setMatchedJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMatchedJobs = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await axios.get(`${MATCH_API_END_POINT}/jobs`, {
          withCredentials: true,
        })

        if (response.data.success) {
          setMatchedJobs(response.data.jobs || [])
        } else {
          setError(response.data.message || 'Unable to load matched jobs.')
        }
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to fetch matched jobs.')
      } finally {
        setLoading(false)
      }
    }

    fetchMatchedJobs()
  }, [])

  return (
    <>
      <Navbar />
      <div className='px-[6%] max-sm:px-[2%] py-8'>
        <motion.div
          initial={{ opacity: 0.2, y: 100 }}
          transition={{ duration: 0.9 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='max-w-7xl mx-auto'
        >
          <div className='bg-white border border-gray-200 rounded-2xl p-8 shadow-sm'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <div>
                <h1 className='text-3xl font-bold'>Matched Jobs</h1>
                <p className='text-sm text-gray-600 mt-2'>Jobs selected based on your resume and profile.</p>
              </div>
              <div className='text-sm text-muted-foreground'>
                {user ? `Logged in as ${user.fullname}` : 'Login to view your best matches.'}
              </div>
            </div>

            <div className='mt-8 min-h-[280px]'>
              {loading && <p className='text-gray-700'>Loading matching jobs...</p>}
              {!loading && error && <p className='text-red-500'>{error}</p>}
              {!loading && !error && matchedJobs.length === 0 && (
                <div className='rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-600'>
                  <p className='text-lg font-medium'>No matched jobs found yet.</p>
                  <p className='mt-2'>Make sure you uploaded your resume in your profile so the matching engine can recommend jobs.</p>
                </div>
              )}
              {!loading && !error && matchedJobs.length > 0 && (
                <>
                  {matchedJobs.length > 5 && (
                    <p className='text-sm text-gray-500 mb-4'>Showing top 5 matching jobs out of {matchedJobs.length} results.</p>
                  )}
                  <div className='grid gap-6 mt-4'>
                    {matchedJobs.slice(0, 5).map((job) => (
                      <Job key={job._id} job={job} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  )
}

export default MatchedJobs
