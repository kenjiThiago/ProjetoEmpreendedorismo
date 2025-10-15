import { useState, useEffect, useCallback, useRef } from 'react'
import type { Job } from '@/data/mockData'
import { useUrlParams } from './useUrlParams'
import { getJobs } from '@/services/jobService'

export function useJobFilters(jobsPerPage: number = 6) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isActive, setIsActive] = useState(false) // Controla se deve fazer requests
  const [shouldUpdateUrl, setShouldUpdateUrl] = useState(false) // Nova flag para controlar atualização da URL

  // Refs para controle de requisições
  const abortControllerRef = useRef<AbortController | null>(null)
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Hook para gerenciar URL params
  const { updateJobUrlParams, getUrlParam } = useUrlParams()

  // Filtros específicos de vagas
  const [searchTerm, setSearchTerm] = useState(() =>
    getUrlParam('search', '')
  )
  const [selectedLocation, setSelectedLocation] = useState(() =>
    getUrlParam('location', 'Localização')
  )
  const [selectedType, setSelectedJobType] = useState(() =>
    getUrlParam('type', 'Modalidade')
  )
  const [selectedLevel, setSelectedLevel] = useState(() =>
    getUrlParam('level', 'Nível')
  )

  // Função para buscar vagas (só executa se isActive for true)
  const fetchJobs = useCallback(async (signal?: AbortSignal) => {
    if (!isActive) return // Não faz request se não estiver ativo

    setError(null)

    try {
      const data = await getJobs({
        search: searchTerm,
        location: selectedLocation,
        type: selectedType,
        level: selectedLevel,
      }, signal)

      if (!signal?.aborted) {
        setJobs(data.vagas)
        setCurrentPage(1)
      }
    } catch (err: any) {
      if (!signal?.aborted && err.name !== 'AbortError') {
        console.error('Erro ao buscar vagas:', err)
        setError(err.message || 'Erro ao carregar vagas')
        setJobs([])
      }
    }
  }, [searchTerm, selectedLocation, selectedType, selectedLevel, isActive])

  // Effect para atualizar URL quando filtros mudam (apenas quando ativo E shouldUpdateUrl for true)
  useEffect(() => {
    if (!isActive || !shouldUpdateUrl) return

    updateJobUrlParams({
      search: searchTerm || null,
      location: selectedLocation === 'Localização' ? null : selectedLocation,
      type: selectedType === 'Modalidade' ? null : selectedType,
      level: selectedLevel === 'Nível' ? null : selectedLevel,
      page: currentPage > 1 ? currentPage.toString() : null
    })
  }, [searchTerm, selectedLocation, selectedType, selectedLevel, currentPage, isActive, shouldUpdateUrl, updateJobUrlParams])

  // Effect para buscar vagas com debounce (só quando ativo)
  useEffect(() => {
    if (!isActive) return

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    debounceTimeoutRef.current = setTimeout(() => {
      const abortController = new AbortController()
      abortControllerRef.current = abortController
      fetchJobs(abortController.signal)
    }, 500)

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchJobs])

  // Cleanup quando component desmonta
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  // Paginação
  const indexOfLastJob = currentPage * jobsPerPage
  const indexOfFirstJob = indexOfLastJob - jobsPerPage
  const paginatedJobs = jobs.slice(indexOfFirstJob, indexOfLastJob)
  const totalPages = Math.ceil(jobs.length / jobsPerPage)

  // Função para ativar/desativar o hook
  const activate = useCallback(() => {
    setIsActive(true)
    // Aguardar um pouco antes de permitir atualizações de URL para evitar conflitos
    setTimeout(() => {
      setShouldUpdateUrl(true)
    }, 100)
  }, [])

  const deactivate = useCallback(() => {
    setIsActive(false)
    setShouldUpdateUrl(false)
  }, [])

  // Funções de atualização dos filtros
  const handleSetSearchTerm = useCallback((value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }, [])

  const handleSetSelectedLocation = useCallback((value: string) => {
    setSelectedLocation(value)
    setCurrentPage(1)
  }, [])

  const handleSetSelectedJobType = useCallback((value: string) => {
    setSelectedJobType(value)
    setCurrentPage(1)
  }, [])

  const handleSetSelectedJobLevel = useCallback((value: string) => {
    setSelectedLevel(value)
    setCurrentPage(1)
  }, [])

  // Função para atualizar página
  const handleSetCurrentPage = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const clearAllFilters = useCallback(() => {
    setSearchTerm("")
    setSelectedLocation("Localização")
    setSelectedJobType("Modalidade")
    setSelectedLevel("Nível")
    setCurrentPage(1)

    if (shouldUpdateUrl) {
      updateJobUrlParams({
        search: null,
        location: null,
        type: null,
        level: null,
        page: null
      })
    }
  }, [updateJobUrlParams, shouldUpdateUrl])

  return {
    jobs: paginatedJobs,
    error,
    totalCount: jobs.length,
    totalPages,
    currentPage,
    searchTerm,
    selectedLocation,
    selectedJobType: selectedType,
    selectedJobLevel: selectedLevel,
    setSearchTerm: handleSetSearchTerm,
    setSelectedLocation: handleSetSelectedLocation,
    setSelectedJobType: handleSetSelectedJobType,
    setSelectedJobLevel: handleSetSelectedJobLevel,
    setCurrentPage: handleSetCurrentPage,
    clearAllFilters,
    activate,
    deactivate,
    isActive
  }
}
