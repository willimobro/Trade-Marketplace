@_private(sourceFile: "ContentView.swift") import Trade_Marketplace
import SwiftUI
import SwiftUI

extension ContentView_Previews {
    @_dynamicReplacement(for: previews) private static var __preview__previews: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/ContentView.swift", line: 20)
        ContentView()
    
#sourceLocation()
    }
}

extension ContentView {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/ContentView.swift", line: 14)
        Text(/*@START_MENU_TOKEN@*/__designTimeString("#42552.[1].[0].property.[0].[0].arg[0].value", fallback: "Hello, World!")/*@END_MENU_TOKEN@*/)
    
#sourceLocation()
    }
}

import struct Trade_Marketplace.ContentView
import struct Trade_Marketplace.ContentView_Previews
