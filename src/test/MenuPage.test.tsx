import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import MenuPage from '@/pages/MenuPage'

describe('MenuPage', () => {
  it('renders the title', () => {
    render(
      <BrowserRouter>
        <MenuPage />
      </BrowserRouter>
    )
    expect(screen.getByText('İdea Atlası')).toBeInTheDocument()
  })

  it('renders navigation buttons', () => {
    render(
      <BrowserRouter>
        <MenuPage />
      </BrowserRouter>
    )
    expect(screen.getByText('Başla')).toBeInTheDocument()
    expect(screen.getByText('Ayarlar')).toBeInTheDocument()
    expect(screen.getByText('Hakkımızda')).toBeInTheDocument()
  })
})
