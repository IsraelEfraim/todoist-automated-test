import { cookies, user } from '../fixtures/defines.json'

describe('Manage Inbox Todos', () => {
    before(() => {
        cy.login(user.email, user.password)
    })

    beforeEach(() => {
        Cypress.Cookies.preserveOnce(...cookies)
    })

    const todos = [
        'Help Josué climb so he can get out of bronze in League',
        'Refactor Compiler Project\'s listeners classes',
        'Get this todo a new creative name'
    ]

    it('should be able to create a todo', () => {
        cy.get('#filter_inbox').click()
        cy.get('.items').then(items => {
            const length = items.find('.task_item_details').length

            todos.forEach(todo => {
                cy.addInboxTodo(todo)
                cy.contains(todo).first().should('exist')
            })

            cy.get('.task_item_details').should('have.length', length + todos.length)
        })
    })

    it('should not be able to create an empty todo', () => {
        cy.get('.task_item_details').its('length').then(length => {
            cy.addInboxTodo('')

            cy.get('.task_item_details').should('have.length', length)
        })
    })

    it('should be able to complete a task', () => {
        cy.get('.task_item_details').first().find('.ist_checkbox').click()
        cy.toggleCompleted()

        cy.get('.items').find('.moreItemsHint').should('exist')

        cy.toggleCompleted()
    })

    it('should be able to delete a todo', () => {
        cy.get('.task_item_details').its('length').then(length => {
            cy.get('li[id^="item"]').first().then(el => {
                el.find('.gear_menu').click()
                cy.get('.ist_menu:visible').find('.sel_delete_task').click()
                cy.get('footer.reactist_modal_box__actions > button[type=submit]').click()

                cy.contains(el.text()).should('not.exist')

                cy.get('.task_item_details').should('have.length', length - 1)
            })
        })
    })

    after(() => {
        cy.deleteInboxTodos()
        cy.clearCookies()
    })
})