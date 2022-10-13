@_private(sourceFile: "Navigatior.swift") import Trade_Marketplace
import SwiftUI
import SwiftUI

extension SuperTextField {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Resources/Navigatior.swift", line: 63)
        ZStack(alignment: .leading) {
            if text.isEmpty { placeholder }
            TextField(__designTimeString("#29853.[3].[4].property.[0].[0].arg[1].value.[1].arg[0].value", fallback: "Search"), text: $text, onEditingChanged: editingChanged, onCommit: commit)
                .autocapitalization(.none)
                .disableAutocorrection(__designTimeBoolean("#29853.[3].[4].property.[0].[0].arg[1].value.[1].modifier[1].arg[0].value", fallback: true))
                .frame(width: __designTimeInteger("#29853.[3].[4].property.[0].[0].arg[1].value.[1].modifier[2].arg[0].value", fallback: 246), height: __designTimeInteger("#29853.[3].[4].property.[0].[0].arg[1].value.[1].modifier[2].arg[1].value", fallback: 25), alignment: .center)
                .foregroundColor(.white)
                .accentColor(Color.green)
        }
    
#sourceLocation()
    }
}

extension Navigatior_Previews {
    @_dynamicReplacement(for: previews) private static var __preview__previews: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Resources/Navigatior.swift", line: 51)
        Navigatior()
    
#sourceLocation()
    }
}

extension Navigatior {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Resources/Navigatior.swift", line: 13)
    
        HStack {
            RoundedRectangle(cornerRadius: __designTimeInteger("#29853.[1].[1].property.[0].[0].arg[0].value.[0].arg[0].value", fallback: 11))
                .frame(width: __designTimeInteger("#29853.[1].[1].property.[0].[0].arg[0].value.[0].modifier[0].arg[0].value", fallback: 278), height: __designTimeInteger("#29853.[1].[1].property.[0].[0].arg[0].value.[0].modifier[0].arg[1].value", fallback: 39))
                .foregroundColor(.white)
                .overlay(
                    ZStack{
                        RoundedRectangle(cornerRadius: __designTimeInteger("#29853.[1].[1].property.[0].[0].arg[0].value.[0].modifier[2].arg[0].value.arg[0].value.[0].arg[0].value", fallback: 11))
                        .frame(width: __designTimeInteger("#29853.[1].[1].property.[0].[0].arg[0].value.[0].modifier[2].arg[0].value.arg[0].value.[0].modifier[0].arg[0].value", fallback: 276), height: __designTimeInteger("#29853.[1].[1].property.[0].[0].arg[0].value.[0].modifier[2].arg[0].value.arg[0].value.[0].modifier[0].arg[1].value", fallback: 37), alignment: .center)
                        .foregroundColor(Color(__designTimeString("#29853.[1].[1].property.[0].[0].arg[0].value.[0].modifier[2].arg[0].value.arg[0].value.[0].modifier[1].arg[0].value.arg[0].value", fallback: "Homebackgroundgreen")))
                        SuperTextField(
                                   placeholder: Text(__designTimeString("#29853.[1].[1].property.[0].[0].arg[0].value.[0].modifier[2].arg[0].value.arg[0].value.[1].arg[0].value.arg[0].value", fallback: "Search...")).foregroundColor(.white),
                                   text: $Search)
                                 
                         
                    }
                        .frame(width: __designTimeInteger("#29853.[1].[1].property.[0].[0].arg[0].value.[0].modifier[2].arg[0].value.modifier[0].arg[0].value", fallback: 276), height: __designTimeInteger("#29853.[1].[1].property.[0].[0].arg[0].value.[0].modifier[2].arg[0].value.modifier[0].arg[1].value", fallback: 37), alignment: .center)
                   )
            
            Spacer()
            NavigationLink(destination: CreateJobView())
                {Image(systemName: __designTimeString("#29853.[1].[1].property.[0].[0].arg[0].value.[2].arg[1].value.[0].arg[0].value", fallback: "plus.app.fill"))
                            .resizable()
                            .foregroundColor(.white)
                            .navigationBarBackButtonHidden(__designTimeBoolean("#29853.[1].[1].property.[0].[0].arg[0].value.[2].arg[1].value.[0].modifier[2].arg[0].value", fallback: true))
                    .frame(width: __designTimeInteger("#29853.[1].[1].property.[0].[0].arg[0].value.[2].arg[1].value.[0].modifier[3].arg[0].value", fallback: 30), height: __designTimeInteger("#29853.[1].[1].property.[0].[0].arg[0].value.[2].arg[1].value.[0].modifier[3].arg[1].value", fallback: 31))}
        }
        .frame(width: __designTimeInteger("#29853.[1].[1].property.[0].[0].modifier[0].arg[0].value", fallback: 349), height: __designTimeInteger("#29853.[1].[1].property.[0].[0].modifier[0].arg[1].value", fallback: 60), alignment: .top)
        .navigationBarTitleDisplayMode(.inline)
        .navigationBarHidden(__designTimeBoolean("#29853.[1].[1].property.[0].[0].modifier[2].arg[0].value", fallback: true))
        .navigationBarBackButtonHidden(__designTimeBoolean("#29853.[1].[1].property.[0].[0].modifier[3].arg[0].value", fallback: true))
        
    
#sourceLocation()
    }
}

import struct Trade_Marketplace.Navigatior
import struct Trade_Marketplace.Navigatior_Previews
import struct Trade_Marketplace.SuperTextField
