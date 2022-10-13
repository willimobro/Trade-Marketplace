//
//  UserSettings.swift
//  Trade Marketplace
//
//  Created by Matthew Larsen on 13/10/22.
//

import SwiftUI

struct UserSettings: View {
    var body: some View {
        List {
            Section {
                Label("Settings", systemImage: "gear")
            }
        }
    }
}

struct UserSettings_Previews: PreviewProvider {
    static var previews: some View {
        UserSettings()
    }
}
