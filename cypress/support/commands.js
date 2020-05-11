// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import { url } from '../fixtures/defines.json'

Cypress.Commands.add('login', (email, password) => {
    cy.visit(url)

    cy.get('.W9ktc > li').first().click()

    cy.get('#login_form').within(() => {
        cy.get('input[name=email]').type(`${email}`)
        cy.get('input[name=password]').type(`${password}`)
        cy.get('.submit_btn').click()
    })
})

Cypress.Commands.add('addInboxTodo', (name) => {
    cy.get('.action_add_item').click({ force: true })
    cy.get('.DraftEditor-editorContainer').type(name).type('{enter}')
})

Cypress.Commands.add('compareLength', (selector, callable, expected) => {
    cy.get(selector).its('length').then(length => {
        callable()
        cy.get(selector).should('have.length', expected(length))
    })
})

Cypress.Commands.add('toggleCompleted', () => {
    cy.get('.list_editor').find('.view_header__actions > button.gear_icon').click()
    cy.get('.ist_menu:visible').find('td[data-track="project|action_show_completed"]:visible').click()
})

Cypress.Commands.add('deleteInboxTodos', () => {
    // Once an element is removed, its children iterator
    // is invalidated, so it shouldn't be used.
    cy.get('.task_item_details').each(ignore => {
        cy.get('li[id^="item"]').first().find('.gear_menu').click()
        cy.get('.ist_menu:visible').find('.sel_delete_task').click()
        cy.get('footer.reactist_modal_box__actions > button[type=submit]').click()
    })
})

Cypress.Commands.overwrite('type', (originalFn, subject, str, options) => {
    return str !== '' ? originalFn(subject, str, options) : subject
})