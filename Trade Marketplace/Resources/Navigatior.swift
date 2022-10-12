//
//  Navigatior.swift
//  Trade Marketplace
//
//  Created by William larsen on 19/09/22.
//

import SwiftUI

struct Navigatior: View {
    @State var Search = ""
    var body: some View {
    
        HStack {
            RoundedRectangle(cornerRadius: 11)
                .frame(width: 278, height: 39)
                .foregroundColor(.white)
                .overlay(
                    ZStack{
                        RoundedRectangle(cornerRadius: 11)
                        .frame(width: 276, height: 37, alignment: .center)
                        .foregroundColor(Color("Homebackgroundgreen"))
                        SuperTextField(
                                   placeholder: Text("Search...").foregroundColor(.white),
                                   text: $Search)
                                 
                         
                    }
                        .frame(width: 276, height: 37, alignment: .center)
                   )
            
            Spacer()
            NavigationLink(destination: CreateJobView())
                {Image(systemName: "plus.app.fill")
                            .resizable()
                            .foregroundColor(.white)
                            .navigationBarBackButtonHidden(true)
                    .frame(width: 30, height: 31)}
        }
        .frame(width: 349, height: 60, alignment: .top)
        .navigationBarTitleDisplayMode(.inline)
        .navigationBarHidden(true)
        .navigationBarBackButtonHidden(true)
        
    }
        
}

struct Navigatior_Previews: PreviewProvider {
    static var previews: some View {
        Navigatior()
    }
}

struct SuperTextField: View {
    
    var placeholder: Text
    @Binding var text: String
    var editingChanged: (Bool)->() = { _ in }
    var commit: ()->() = { }
    
    var body: some View {
        ZStack(alignment: .leading) {
            if text.isEmpty { placeholder }
            TextField("Search", text: $text, onEditingChanged: editingChanged, onCommit: commit)
                .autocapitalization(.none)
                .disableAutocorrection(true)
                .frame(width: 246, height: 25, alignment: .center)
                .foregroundColor(.white)
                .accentColor(Color.green)
        }
    }
    
}
