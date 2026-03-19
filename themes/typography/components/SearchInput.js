import { useRouter } from 'next/router'
import { useImperativeHandle, useRef, useState } from 'react'
import { useGlobal } from '@/lib/global'
let lock = false

const SearchInput = props => {
  const { currentSearch, cRef, className } = props
  const [onLoading, setLoadingState] = useState(false)
  const router = useRouter()
  const searchInputRef = useRef()
  const { locale } = useGlobal()
  useImperativeHandle(cRef, () => {
    return {
      focus: () => {
        searchInputRef?.current?.focus()
      }
    }
  })

  const handleSearch = () => {
    const key = searchInputRef.current.value
    if (key && key !== '') {
      setLoadingState(true)
      router.push({ pathname: '/search', query: { s: key } }).then(r => {
        setLoadingState(false)
      })
    } else {
      router.push({ pathname: '/' }).then(r => {})
    }
  }
  const handleKeyUp = e => {
    if (e.keyCode === 13) {
      // 回车
      handleSearch(searchInputRef.current.value)
    } else if (e.keyCode === 27) {
      // ESC
      cleanSearch()
    }
  }
  const cleanSearch = () => {
    searchInputRef.current.value = ''
  }

  const [showClean, setShowClean] = useState(false)
  const updateSearchKey = val => {
    if (lock) {
      return
    }
    searchInputRef.current.value = val

    if (val) {
      setShowClean(true)
    } else {
      setShowClean(false)
    }
  }
  function lockSearchInput () {
    lock = true
  }

  function unLockSearchInput () {
    lock = false
  }

  return (
    <div className={'flex w-full bg-gray-100 dark:bg-gray-800 rounded-lg border dark:border-gray-700 ' + className}>
      <input
        ref={searchInputRef}
        type="text"
        className={
          'outline-none w-full text-sm pl-4 pr-10 rounded-lg transition dark:text-gray-300 font-light leading-10 text-black bg-transparent'
        }
        onKeyUp={handleKeyUp}
        onCompositionStart={lockSearchInput}
        onCompositionUpdate={lockSearchInput}
        onCompositionEnd={unLockSearchInput}
        placeholder={locale.SEARCH.ARTICLES}
        onChange={e => updateSearchKey(e.target.value)}
        defaultValue={currentSearch || router?.query?.s || ''}
      />

      {showClean && (
        <div className="-ml-12 cursor-pointer float-right items-center justify-center py-2 mr-2">
          <i
            className="hover:text-black transform duration-200 text-gray-400 dark:text-gray-300 cursor-pointer fas fa-times"
            onClick={cleanSearch}
          />
        </div>
      )}

      <div
        className="cursor-pointer float-right flex items-center justify-center px-4 rounded-r-lg bg-[var(--primary-color)] text-white hover:opacity-80 transition-opacity"
        onClick={handleSearch}
      >
        <i
          className={`transform duration-200 fas ${
            onLoading ? 'fa-spinner animate-spin' : 'fa-search'
          }`}
        />
        <span className="ml-2 hidden md:block">{locale.NAV.SEARCH}</span>
      </div>
    </div>
  )
}

export default SearchInput
