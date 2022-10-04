//
//  Tab.swift
//  Trade Marketplace
//
//  Created by William larsen on 29/09/22.
//

import SwiftUI

struct TabItem: Identifiable    {
    var id = UUID()
    var icon = String()
    var tab: Tab
}

var tabItems = [
    TabItem(icon: "house.fill", tab: .home),
    TabItem(icon: "magnifyingglass", tab: .search),
    TabItem(icon: "mail.stack", tab: .account),
    TabItem(icon: "message", tab: .message),
    TabItem(icon: "person", tab: .profile)
]

enum Tab: String    {
    case home
    case search
    case account
    case message
    case profile
}
