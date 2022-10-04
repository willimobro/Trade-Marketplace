import SwiftUI

struct NavigatorAcc: View {
    @State var text = ""
    var body: some View {
        Rectangle()
            .frame(height: 84, alignment: .bottom)
            .foregroundColor(/*@START_MENU_TOKEN@*/Color("CanvasColor")/*@END_MENU_TOKEN@*/)
            .overlay(
                Text("\(text)")
                .font(.custom("Poppins-SemiBold", size: 20))
                .padding(.leading, 12)
                .foregroundColor(.white)
                .padding(.horizontal, 25)
                .frame(height: 64, alignment: .bottom)
            )
    }
}

struct NavigatorAcc_Previews: PreviewProvider {
    static var previews: some View {
        NavigatorAcc()
    }
}

