import SearchEngine from '../search/SearchEngine'

declare module 'fastify' {
  interface FastifyInstance {
    searchEngine: SearchEngine
  }
}
