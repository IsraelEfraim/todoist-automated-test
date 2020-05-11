import { cookies, user } from '../fixtures/defines.json'

describe('To perform login or not to perform', () => {
    it('should be logged in', () => {
        cy.login(user.email, user.password)
        cy.url().should('include', '/app')

        cookies.forEach(cookie => {
            cy.getCookie(cookie).should('exist')
        })
    })

    it('should complain about mismatched email/password', () => {
        cy.login(user.email, 'randompassword123')
        cy.get('.error_msg').should('exist')

        cookies.forEach(cookie => {
            cy.getCookie(cookie).should('not.exist')
        })
    })

    it('should complain about blank password', () => {
        cy.login(user.email, '')
        cy.get('.error_msg').should('exist')

        cookies.forEach(cookie => {
            cy.getCookie(cookie).should('not.exist')
        })
    })

    it('should be able to logout', () => {
        cy.login(user.email, user.password)

        cy.get('button[aria-controls=setting_menu]').click()
        cy.get('#setting_menu').find('.usermenu__row').last().click()

        cy.url().should('not.include', '/app')
    })
})